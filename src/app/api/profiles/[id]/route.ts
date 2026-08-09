export const runtime = 'edge';

import { getDb } from '@/lib/db';
import { birthProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profileId = parseInt(id, 10);

  if (isNaN(profileId)) {
    return Response.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  const db = getDb();
  if (db) {
    try {
      const profile = await db.select().from(birthProfiles).where(eq(birthProfiles.id, profileId)).limit(1);
      if (profile.length > 0) {
        return Response.json(profile[0]);
      }
    } catch (err) {
      console.error('[VedAI] DB read error:', err);
    }
  }

  return Response.json({ error: 'Profile not found' }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profileId = parseInt(id, 10);

  if (isNaN(profileId)) {
    return Response.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { name, date, time, place, latitude, longitude, timezone } = body;

  if (latitude !== undefined && latitude !== null && latitude !== '') {
    const parsedLatitude = Number(latitude);
    if (isNaN(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90) {
      return Response.json({ error: 'Invalid latitude (must be between -90 and 90)' }, { status: 400 });
    }
  }

  if (longitude !== undefined && longitude !== null && longitude !== '') {
    const parsedLongitude = Number(longitude);
    if (isNaN(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180) {
      return Response.json({ error: 'Invalid longitude (must be between -180 and 180)' }, { status: 400 });
    }
  }

  const db = getDb();
  if (db) {
    try {
      const result = await db.update(birthProfiles)
        .set({
          ...(name && { name }),
          ...(date && { date }),
          ...(time && { time }),
          ...(place && { place }),
          ...(latitude && { latitude }),
          ...(longitude && { longitude }),
          ...(timezone && { timezone }),
        })
        .where(eq(birthProfiles.id, profileId))
        .returning();

      if (result.length > 0) return Response.json(result[0]);
    } catch (err) {
      console.error('[VedAI] DB update error:', err);
    }
  }

  return Response.json({ error: 'Profile not found' }, { status: 404 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profileId = parseInt(id, 10);

  if (isNaN(profileId)) {
    return Response.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  const db = getDb();
  if (db) {
    try {
      await db.delete(birthProfiles).where(eq(birthProfiles.id, profileId));
      return Response.json({ deleted: true });
    } catch (err) {
      console.error('[VedAI] DB delete error:', err);
    }
  }

  return Response.json({ error: 'Profile not found' }, { status: 404 });
}
