import os from 'os';
import axios from 'axios';

/**
 * Get the server's private (internal) IPv4 address
 */
const getPrivateIP = () => {
  const nets = os.networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address; // return first private/external IPv4 address
      }
    }
  }

  return '0.0.0.0'; // fallback
};

/**
 * Get the server's public IP address using an external service
 */
const getPublicIP = async () => {
  try {
    const res = await axios.get('https://api.ipify.org?format=json');
    return res.data.ip; // e.g., "203.0.113.25"
  } catch (err) {
    console.error('Failed to fetch public IP:', err);
    return '0.0.0.0';
  }
};

/**
 * Get both private and public IPs
 */
export const getIPAddresses = async () => {
  const privateIP = getPrivateIP();
  const publicIP = await getPublicIP();

  return { privateIP, publicIP };
};
