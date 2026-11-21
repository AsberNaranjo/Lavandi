// "Regresar" en el encabezado de las pantallas de acceso (tarea 2.3, C-230): vuelve a la pantalla anterior, como el
// regreso de Android y el gesto de iPhone. Si la pantalla se abrió sin una anterior, lleva a la que corresponde.
import { useRouter, type Href } from 'expo-router';

export function useRegresar(siNoHayAnterior: Href): () => void {
  const router = useRouter();
  return () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(siNoHayAnterior);
    }
  };
}
