export interface Exportation {
    [x: string]: any
    numero_do?: string
    empresa?: string
    factura?: string
    booking?: string
    CP?: string
    estado?: string
    SAE?: string
    BL?: string
    dex?: string
    createdAt?: string
}


export type initialExportation = Pick<Exportation, 'numero_do' | 'factura' | 'booking' | 'CP'>