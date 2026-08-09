export const runtime = 'edge';

import { getDb } from '@/lib/db';
import { birthProfiles } from '@/lib/db/schema';

export async function GET() {
  const db = getDb();
  if (db) {
    try {
      const profiles = await db.select().from(birthProfiles);
      return Response.json(profiles);
    } catch (err) {
      console.error('[VedAI] DB read error:', err);
    }
  }
  return Response.json({ error: 'Database connection failed' }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, date, time, place, latitude, longitude, timezone } = body;

    if (!name || !date) {
      return Response.json(
        { error: 'Missing required fields: name, date' },
        { status: 400 }
      );
    }

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    const hasLatitude = latitude !== undefined && latitude !== null && latitude !== '';
    const hasLongitude = longitude !== undefined && longitude !== null && longitude !== '';

    if (hasLatitude && (isNaN(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90)) {
      return Response.json(
        { error: 'Invalid latitude (must be between -90 and 90)' },
        { status: 400 }
      );
    }

    if (hasLongitude && (isNaN(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180)) {
      return Response.json(
        { error: 'Invalid longitude (must be between -180 and 180)' },
        { status: 400 }
      );
    }

    const db = getDb();
    if (db) {
      try {
        const result = await db.insert(birthProfiles).values({
          name: String(name).slice(0, 100),
          date,
          time: time || '12:00',
          place: place || '',
          latitude: hasLatitude ? parsedLatitude : 0,
          longitude: hasLongitude ? parsedLongitude : 0,
          timezone: timezone || 'UTC',
        }).returning();

        return Response.json(result[0], { status: 201 });
      } catch (err) {
        console.error('[VedAI] DB insert error:', err);
      }
    }

    return Response.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );

  } catch {
    return Response.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}
