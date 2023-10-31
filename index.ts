
function formatName(name: string) {
    if(!name) throw new Error("missing parameter for formatName");

  return name
    .replace(/ /g, "_")
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .toLowerCase();
}

const AREA_PATH = "./areas";
const STATE_PATH = "./states";
const COUNTRY_PATH = "./countries";

//retrieve json country Code


type GeoJsonFeature = {
    type: string;
    properties: { [key: string]: any };
    geometry: {
        type: string;
        coordinates: any[];
    };
};

const GEOJSON_BASE: { type: string, features: GeoJsonFeature[] } = {
    type: 'FeatureCollection',
    features: [],
};

function requireFile(filePath: string) {
  try {
    return require(`${filePath}.json`);
  } catch (e) {
    // @ts-ignore
      if (e.code !== "MODULE_NOT_FOUND") throw e;
    return null;
  }
}

/**
 * Type definition for the parameters to generate a GeoJSON.
 * @param {string} countryName
 * @param {string} stateName
 * @param {string} areaName
 * @param {Object} properties
 * @return {Object}
 *
 */
export type geoParamsType = {
  countryName: string,
  countryCode?: string,
  stateName?: string,
  areaName?: string,
  properties?: {
    [key: string]: any
  },
}

/**
 * Generates a GeoJSON based on the given parameters.
 * @param params - Parameters to generate the GeoJSON.
 * @returns The generated GeoJSON.
 */
function getGeoJsonFromParams(params: geoParamsType) {

    //countryName is required
    if (!params.countryName && !params.countryCode) {
        throw new Error("countryName or countryCode is required");
    } else if (!params.countryName && params.countryCode) {
        //check if countryCode is valid, must be 2 letters
        if (params.countryCode.length !== 2) {
            throw new Error("countryCode must be 2 letters");
        }
    }

   let filePath: string;

  if (params.countryName && params.areaName){
    filePath = `${AREA_PATH}/${formatName(params.countryName)}/${formatName(params.areaName)}`;
  } else if (params.countryName && params.stateName){
    filePath = `${STATE_PATH}/${formatName(params.countryName)}/${formatName(params.stateName)}`;
  } else{
    filePath = `${COUNTRY_PATH}/${formatName(params.countryName)}`;
  }

  const geoJson = requireFile(filePath);

  // Add properties to the GeoJSON
  if (geoJson && geoJson.features) {
    geoJson.features.forEach((feature: { properties: any }) => {
      if (params.properties) {
        feature.properties = {
          ...feature.properties,
          ...params.properties,
        };
      }
    });
  }
  return geoJson;
}
/**
 * Combines multiple GeoJSONs into a single one.
 * @param paramsArray - An array of parameters to generate multiple GeoJSONs.
 * @returns The combined GeoJSON.
 */
function combineGeoJson(paramsArray: geoParamsType[]) {
    const combinedGeoJson = { ...GEOJSON_BASE };
    paramsArray.forEach(params => {
        const geoJson = getGeoJsonFromParams(params);
        if (geoJson && geoJson.features) {
            combinedGeoJson.features.push(...geoJson.features);
        }
    });
    return combinedGeoJson;
}



function forCountry(countryName: string) {
  return requireFile(`./countries/${formatName(countryName)}`)
}

function forArea(countryName:string, areaName:string) {
  return requireFile(`./areas/${formatName(countryName)}/${formatName(areaName)}`)
}

function forState(countryName:string, stateName:string) {
  return requireFile(`./states/${formatName(countryName)}/${formatName(stateName)}`)
}


export {
    combineGeoJson,
    forCountry,
    forState,
    forArea,
};
