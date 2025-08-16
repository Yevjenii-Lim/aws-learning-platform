import { NextRequest, NextResponse } from 'next/server';
import { getAllServices, getServiceById, getTutorialById } from '../../../lib/dynamodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const tutorialId = searchParams.get('tutorialId');

    if (serviceId && tutorialId) {
      // Get specific tutorial
      const tutorial = await getTutorialById(serviceId, tutorialId);
      
      if (!tutorial) {
        return NextResponse.json(
          { success: false, error: 'Tutorial not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: tutorial });
    }

    if (serviceId) {
      // Get service by ID
      const service = await getServiceById(serviceId);
      
      if (!service) {
        return NextResponse.json(
          { success: false, error: 'Service not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: service });
    }

    // Get all services
    const services = await getAllServices();
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 