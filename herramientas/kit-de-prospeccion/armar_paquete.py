# -*- coding: utf-8 -*-
"""Arma el paquete que Nadir le manda a EL CLIENTE con el kit: la lista de lavanderías y todo el kit en un solo archivo
comprimido, con nombres claros y ordenado por uso.

    python herramientas/kit-de-prospeccion/armar_paquete.py

Antes hay que correr construir_kit.py y version_cliente.py, y recalcular los dos Excel. Deja en vault/cliente/envios/
el archivo «Lavandi - Kit actualizado.zip».

El primer envío (2026-10-26) llevaba además la propuesta del kit y se llamaba «Lavandi - Kit para revisar.zip». Ese
archivo y «Lavandi - Propuesta del kit.pdf» quedan como registro de lo que se mandó: este script ya no los toca.
Desde el ajuste del 2026-11-05 (lo que dejó la recalibración) el paquete no lleva la propuesta, que el cliente ya revisó.
"""
import os
import zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, '..', '..'))
KIT = os.path.join(RAIZ, 'vault', 'cliente', 'kit-de-prospeccion')
LISTA = os.path.join(RAIZ, 'vault', 'cliente', 'comunicaciones', 'lavanderias-para-invitar.xlsx')
SALIDA = os.path.join(RAIZ, 'vault', 'cliente', 'envios')
ZIP = os.path.join(SALIDA, 'Lavandi - Kit actualizado.zip')

# Ruta dentro del comprimido -> archivo de origen. El orden es el de uso, no el de fabricación.
CARPETA = 'Kit para sumar lavanderías'
CONTENIDO = [
    ('Lista de lavanderías para invitar.xlsx', LISTA),
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


def main():
    os.makedirs(SALIDA, exist_ok=True)
    with zipfile.ZipFile(ZIP, 'w', zipfile.ZIP_DEFLATED) as z:
        for destino, origen in CONTENIDO:
            ruta = origen if os.path.isabs(origen) else os.path.join(KIT, origen)
            if not os.path.exists(ruta):
                raise SystemExit('Falta %s: corre antes construir_kit.py' % ruta)
            z.write(ruta, destino)
    print('ZIP', ZIP, '·', len(CONTENIDO), 'archivos ·', os.path.getsize(ZIP) // 1024, 'KB')


if __name__ == '__main__':
    main()
