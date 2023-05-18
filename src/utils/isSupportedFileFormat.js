export default function isSupportedFileFormat(extension, supportedFileFormats) {
  const arr = [...supportedFileFormats].map((e) => e.toLowerCase());

  return arr.includes(extension.toLowerCase());
}
