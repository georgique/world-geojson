function formatName(name) {
  return name
    .replace(/ /g, '_')
    .replace(/\./g, '')
    .replace(/&/g, 'and')
    .toLowerCase()
}

function requireFile(filePath) {
  try {
    return require(`${filePath}.json`)
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e

    return null
  }
}

function forCountry(countryName) {
  return requireFile(`./countries/${formatName(countryName)}`)
}

function forArea(countryName, areaName) {
  return requireFile(`./areas/${formatName(countryName)}/${formatName(areaName)}`)
}

function forState(countryName, stateName) {
  return requireFile(`./states/${formatName(countryName)}/${formatName(stateName)}`)
}

module.exports = {
  forCountry,
  forState,
  forArea,
}
