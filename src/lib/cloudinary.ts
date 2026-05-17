/**
 * Transforma una URL de Cloudinary para normalizar todas las imágenes
 * al mismo ratio con fondo blanco, sin recortar el producto.
 *
 * c_pad  → rellena el espacio sobrante con fondo blanco (no recorta)
 * b_white → fondo blanco
 * g_center → centra la imagen
 * q_auto, f_auto → calidad y formato optimizados automáticamente
 */
export function cloudinaryUrl(
  url: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    crop?: "pad" | "fill" | "fit" | "scale";
    background?: string;
  } = {}
): string {
  if (!url) return "/placeholder.png";
  if (!url.includes("res.cloudinary.com")) return url;

  const {
    width = 800,
    height = 1000,
    crop = "pad",
    background = "white",
  } = options;

  const transform = `w_${width},h_${height},c_${crop},b_${background},g_center,q_auto,f_auto`;

  return url.replace("/image/upload/", `/image/upload/${transform}/`);
}