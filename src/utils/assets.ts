import heroIndustrialPlant from '../assets/images/hero_industrial_plant_1794586366598.jpg';
import blowMoldingImg from '../assets/images/machinery_blow_molding_1794586368967.jpg';
import injectionMoldingImg from '../assets/images/machinery_injection_molding_1794586368841.jpg';
import roWaterPlantImg from '../assets/images/machinery_ro_water_plant_1794586369886.jpg';
import solarIndustrialImg from '../assets/images/service_solar_industrial_1794586369402.jpg';

export const OFFICIAL_LOGO_URL = '/assets/aistudio/Enverto_Solutions_Official_Logo_2026_a1c9880a.jpeg';

export const ASSET_MAP: Record<string, string> = {
  hero_plant: heroIndustrialPlant,
  blow_molding: blowMoldingImg,
  injection_molding: injectionMoldingImg,
  ro_plant: roWaterPlantImg,
  solar_industrial: solarIndustrialImg,
};

export function resolveAssetUrl(imageKey?: string, imageDataUrl?: string): string | undefined {
  if (imageDataUrl && imageDataUrl.trim().length > 0) {
    return imageDataUrl;
  }
  if (imageKey && ASSET_MAP[imageKey]) {
    return ASSET_MAP[imageKey];
  }
  return undefined;
}
