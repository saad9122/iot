import { NextRequest, NextResponse } from 'next/server';
import { sensorDataSchema } from '@/util/validationSchema';

// export async function POST(request: NextRequest) {
//   try {
//     const contentType = request.headers.get('content-type');
//     if (!contentType || !contentType.includes('application/json')) {
//       return NextResponse.json(
//         { message: 'Invalid content type', error: 'Expected application/json' },
//         { status: 400 },
//       );
//     }

//     const body = await request.text();
//     let data;
//     try {
//       data = JSON.parse(body);
//     } catch (parseError) {
//       console.error('JSON parsing error:', parseError);
//       return NextResponse.json({ message: 'Invalid JSON', error: parseError.message }, { status: 400 });
//     }

//     let validatedData;
//     try {
//       validatedData = await sensorDataSchema.validate(data, { abortEarly: false });
//     } catch (validationError) {
//       console.error('Data validation error:', validationError);
//       return NextResponse.json(
//         {
//           message: 'Invalid sensor data',
//           error: validationError.errors || 'Unknown validation error',
//         },
//         { status: 400 },
//       );
//     }

//     // Get the WebSocket server instance and broadcast
//     const wss = getWSServer();
//     if (wss) {
//       wss.clients.forEach((client) => {
//         if (client.readyState === client.OPEN) {
//           client.send(JSON.stringify(validatedData));
//         }
//       });
//     }

//     return NextResponse.json(
//       {
//         message: 'Sensor data processed successfully',
//         clientsNotified: wss?.clients.size || 0,
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error('Unexpected error in POST handler:', error);
//     return NextResponse.json({ message: 'Server error processing sensor data', error: error.message }, { status: 500 });
//   }
// }

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const deviceId = params.id;

//     // Find the device by ID
//     const device = await db.device.findUnique({
//       where: { id: deviceId },
//       include: {
//         sensorReadings: {
//           orderBy: { createdAt: 'desc' },
//         },
//       },
//     });

//     if (!device) {
//       return NextResponse.json(
//         { message: 'Device not found', error: 'No device found with the given ID' },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       {
//         message: 'Device and sensor readings retrieved successfully',
//         data: {
//           device: {
//             id: device.id,
//             name: device.name,
//             location: device.location,
//             description: device.description,
//             setTemperature: device.setTemperature,
//             reverseRelay: device.reverseRelay,
//             wifiName: device.wifiName,
//             lastActivityAt: device.lastActivityAt,
//           },
//           sensorReadings: device.sensorReadings,
//         },
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error('Unexpected error in GET handler:', error);
//     return NextResponse.json({ message: 'Server error retrieving sensor data', error: error.message }, { status: 500 });
//   }
// }

export async function GET() {
  return NextResponse.json(latestSensorData);
}

interface ILatestSensorData {
  temperature: Number;
  voltage: number;
  current: number;
  power: number;
  relayState: boolean;
  temperatureThreshold: number;
  lastUpdated: Date;
}

// In a real app, you'd use a database
let latestSensorData: ILatestSensorData = {
  temperature: 0,
  voltage: 0,
  current: 0,
  power: 0,
  relayState: false,
  temperatureThreshold: 25.0,
  lastUpdated: new Date(),
};

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        {
          message: 'Invalid content type',
          error: 'Expected application/json',
        },
        { status: 400 },
      );
    }

    // Parse raw body text
    const body = await request.text();

    let data;
    try {
      data = JSON.parse(body);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json(
        {
          message: 'Invalid JSON',
          error: String(parseError),
        },
        { status: 400 },
      );
    }

    // Validate data with more lenient schema
    try {
      const validatedData = await sensorDataSchema.validate(data);

      console.log(validatedData.temperature);

      latestSensorData = {
        temperature: validatedData.temperature ?? 0, // Provide default values for missing properties
        voltage: validatedData.voltage ?? 0,
        current: validatedData.current ?? 0,
        power: validatedData.Power ?? 0,
        relayState: validatedData.relayState ?? false,
        temperatureThreshold: validatedData.temperatureThreshold ?? 0,
        lastUpdated: new Date(),
      };

      // Store or process validated data

      return NextResponse.json(
        {
          message: 'Sensor data received successfully',
          data: validatedData,
        },
        { status: 200 },
      );
    } catch (validationError) {
      return NextResponse.json(
        {
          message: 'Invalid sensor data',
          error: 'Unknown validation error',
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Unexpected error in POST handler:', error);
    return NextResponse.json(
      {
        message: 'Server error processing sensor data',
        error: String(error),
      },
      { status: 500 },
    );
  }
}
