# -*- coding: utf-8 -*-
"""Arma el paquete que Nadir le manda a EL CLIENTE para revisar el kit: la propuesta en PDF, la lista de lavanderías y
todo el kit en un solo archivo comprimido, con nombres claros y ordenado por uso.

    python herramientas/kit-de-prospeccion/armar_paquete.py

Antes hay que correr construir_kit.py y version_cliente.py, y recalcular los dos Excel. Deja en vault/cliente/envios/:
  - Lavandi - Propuesta del kit.pdf
  - Lavandi - Kit para revisar.zip
"""
import os
import subprocess
import zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, '..', '..'))
KIT = os.path.join(RAIZ, 'vault', 'cliente', 'kit-de-prospeccion')
LISTA = os.path.join(RAIZ, 'vault', 'cliente', 'comunicaciones', 'lavanderias-para-invitar.xlsx')
PROPUESTA_HTML = os.path.join(RAIZ, 'herramientas', 'propuesta-kit-socios', 'pagina.html')
SALIDA = os.path.join(RAIZ, 'vault', 'cliente', 'envios')
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

PROPUESTA_PDF = os.path.join(SALIDA, 'Lavandi - Propuesta del kit.pdf')
ZIP = os.path.join(SALIDA, 'Lavandi - Kit para revisar.zip')

# Ruta dentro del comprimido -> archivo de origen. El orden es el de uso, no el de fabricación.
CARPETA = 'Kit para sumar lavanderías'
CONTENIDO = [
    ('1. Propuesta del kit.pdf', PROPUESTA_PDF),
    ('2. Lista de lavanderías para invitar.xlsx', LISTA),
    (CARPETA + '/1 Para empezar/Guía del kit.pdf', '00-guia-del-kit.pdf'),
    (CARPETA + '/1 Para empezar/Cómo hablarle a cada lavandería.pdf', '11-como-hablarle-a-cada-lavanderia.pdf'),
    (CARPETA + '/2 Por teléfono y WhatsApp/Hoja de presentación.pdf', '01-hoja-de-presentacion.pdf'),
    (CARPETA + '/2 Por teléfono y WhatsApp/Guion de llamada.pdf', '02-guion-de-llamada.pdf'),
    (CARPETA + '/2 Por teléfono y WhatsApp/Mensajes de WhatsApp.pdf', '03-mensajes-de-whatsapp.pdf'),
    (CARPETA + '/2 Por teléfono y WhatsApp/Imagen para WhatsApp.png', '03-imagen-whatsapp.png'),
    (CARPETA + '/3 En persona/Presentación para la visita.pptx', '04-presentacion-para-la-visita.pptx'),
    (CARPETA + '/3 En persona/Presentación para la visita.pdf', '04-presentacion-para-la-visita.pdf'),
    (CARPETA + '/3 En persona/Hoja de visita.pdf', '06-hoja-de-visita.pdf'),
    (CARPETA + '/3 En persona/Carta de interés de lavandería fundadora.pdf', '05-carta-de-interes.pdf'),
    (CARPETA + '/3 En persona/Formato de registro.pdf', '07-formato-de-registro.pdf'),
    (CARPETA + '/4 Para comprobar el negocio/Entrevista a personas.pdf', '08-entrevista-a-personas.pdf'),
    (CARPETA + '/4 Para comprobar el negocio/Conversación con personas que lavan en casa.pdf', '09-conversacion-lavan-en-casa.pdf'),
    (CARPETA + '/4 Para comprobar el negocio/Libro de resultados.xlsx', '10-libro-de-resultados.xlsx'),
]


def propuesta_pdf():
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=20000',
                    '--print-to-pdf=' + PROPUESTA_PDF, 'file:///' + PROPUESTA_HTML.replace('\\', '/')], check=True, capture_output=True)


def main():
    os.makedirs(SALIDA, exist_ok=True)
    propuesta_pdf()
    with zipfile.ZipFile(ZIP, 'w', zipfile.ZIP_DEFLATED) as z:
        for destino, origen in CONTENIDO:
            ruta = origen if os.path.isabs(origen) else os.path.join(KIT, origen)
            if not os.path.exists(ruta):
                raise SystemExit('Falta %s: corre antes construir_kit.py' % ruta)
            z.write(ruta, destino)
    print('PDF', PROPUESTA_PDF)
    print('ZIP', ZIP, '·', len(CONTENIDO), 'archivos ·', os.path.getsize(ZIP) // 1024, 'KB')


if __name__ == '__main__':
    main()
