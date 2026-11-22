<?php

namespace App\Cobro;

use App\Models\Pago;

/**
 * La pasarela de pago, detrás de la frontera del componente cobro (vault/arquitectura/c3-api.md, "Habla con la
 * pasarela"; openspec/changes/pago/design.md, decisión 2). La llamada a la pasarela vive solo detrás de esta interfaz:
 * ni la base ni la API nombran al proveedor (C-192; ADR-0016, regla 10).
 *
 * Hoy la implementa la pasarela simulada de local y las pruebas (App\Cobro\PasarelaSimulada). La de Conekta, la del
 * contrato, llega con la sección 3 de tasks.md (ADR-0010). Si el cliente firma el cambio de pasarela (DD-079), la
 * elegida es otra implementación, con su ADR. Cuál cobra en cada entorno lo dice App\Cobro\Pasarelas.
 *
 * Ninguna implementación recibe ni devuelve datos de tarjeta: la tarjeta la captura y la resguarda la pasarela
 * (NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3).
 */
interface Pasarela
{
    /**
     * El código de la pasarela, el que se guarda en pagos.pasarela y en eventos_pasarela.pasarela.
     */
    public function codigo(): string;

    /**
     * Crea en la pasarela la orden del cobro, por el monto del cobro, con su checkout, autenticada con la llave de la
     * configuración del entorno (pago-E01 y pago-E17).
     *
     * @throws PasarelaNoDisponible si falta la llave o la pasarela no responde
     */
    public function crearOrden(Pago $cobro): OrdenDePasarela;

    /**
     * La URL del checkout de una orden si todavía se puede pagar en él, o null si ya venció o la pasarela ya no lo
     * acepta (pago-E01: un solo checkout vigente por cobro).
     *
     * @throws PasarelaNoDisponible si falta la llave o la pasarela no responde
     */
    public function checkoutVigente(string $idOrden): ?string;
}
