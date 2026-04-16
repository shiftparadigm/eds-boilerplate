import { getHref, getOrigin, getWindow } from '../utils/window-utils.js';

const ALLOWED_CONFIGS = ['prod', 'stage', 'dev', 'qa'];

/**
 * This function calculates the environment in which the site is running based on the URL.
 * It defaults to 'prod'. In non 'prod' environments, the value can be overwritten using
 * the 'environment' key in sessionStorage.
 *
 * @returns {string} - environment identifier (dev, stage, qa or prod).
 */
export function calcEnvironment() {
  const href = getHref();
  let environment = 'prod';

  if (href.includes('aem.page') || href.includes('aem.live')) {
    environment = 'dev';
  } else if (href.includes('localhost')) {
    environment = 'local';
  }

  const environmentFromConfig = getWindow().sessionStorage.getItem('environment');

  if (
    environmentFromConfig
    && ALLOWED_CONFIGS.includes(environmentFromConfig)
    && environment !== 'prod'
  ) {
    return environmentFromConfig;
  }

  return environment;
}

function buildConfigURL(environment) {
  const env = environment || calcEnvironment();
  const fileName = `configs.json?sheet=${env}`;
  const filePath = `${getOrigin()}/${fileName}`;

  return new URL(filePath);
}

/**
 * This function retrieves a full configuration for a given environment.
 *
 * @param {string} [environment] - Optional, overwrite the current environment.
 * @returns {Promise<Array<Object>>} - The configuration key value pairs.
 */
export async function getConfig(environment) {
  const env = environment || calcEnvironment();
  let configString = getWindow().sessionStorage.getItem(`config:${env}`);

  if (!configString) {
    const response = await fetch(buildConfigURL(env));
    if (!response.ok) {
      throw new Error(`Failed to fetch config for ${env}`);
    }
    configString = await response.text();
    getWindow().sessionStorage.setItem(`config:${env}`, configString);
  }

  const configResponse = JSON.parse(configString);
  return configResponse.data;
}

/**
 * This function retrieves a configuration value for a given environment.
 *
 * @param {string} configParam - The configuration parameter to retrieve.
 * @param {string} [environment] - Optional, overwrite the current environment.
 * @returns {Promise<string|undefined>}
 */
export async function getConfigValue(configParam, environment) {
  const configElements = await getConfig(environment);
  return configElements.find((c) => c.key === configParam)?.value;
}

export function getCookie(cookieName) {
  const cookies = document.cookie.split(';');

  return cookies
    .map((cookie) => cookie.trim().split('='))
    .find(([name]) => name === cookieName)?.[1];
}

export function deleteCookie(cookieName) {
  document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}
