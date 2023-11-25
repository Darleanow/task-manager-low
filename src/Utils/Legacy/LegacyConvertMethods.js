export async function convertImageToBase64(p_ImagePath) {
  const response = await fetch(p_ImagePath);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function convertBase64ToImage() {}
