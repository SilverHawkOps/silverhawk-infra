function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];
  return null;
}


export { getArgValue };
