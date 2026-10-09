// Resolve the UTC offset of an IANA timezone at a specific local wall-clock
// moment. Birth charts need the offset AT the birth instant, including any
// historical daylight-saving rule in effect then — a fixed per-country offset
// would shift the Ascendant and house cusps for anyone born under DST.
//
// Luxon relies on the host's IANA tz database (via Intl), so no tzdata is
// bundled. All evergreen browsers carry the full zone set.
import { DateTime } from 'luxon';

/**
 * UTC offset in hours (e.g. -4 for New York in summer, +5.75 for Kathmandu)
 * for the given local date/time interpreted in `zone`. Falls back to 0 for an
 * empty or unknown zone.
 */
export function offsetForZone(
  zone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): number {
  if (!zone) return 0;
  const dt = DateTime.fromObject(
    { year, month, day, hour, minute },
    { zone },
  );
  return dt.isValid ? dt.offset / 60 : 0;
}

/** Current offset of a zone in hours — used only for the city-list hint. */
export function currentOffset(zone: string): number {
  if (!zone) return 0;
  const dt = DateTime.now().setZone(zone);
  return dt.isValid ? dt.offset / 60 : 0;
}
