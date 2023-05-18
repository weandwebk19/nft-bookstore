export default function getFileExtension(filename) {
  return filename.split(".").pop().toLowerCase();
}
