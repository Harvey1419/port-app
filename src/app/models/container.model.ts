
export type Volumen = 20 | 40

export interface Container {
    numero_do?: string
    numero_contenedor?: string
    estado?: string
    volumen?: Volumen
    tara?: number
    naviera?: string
    sellos?: string
    destino?: string
    ETA?: string
    material?: string
    createdAt?: string
    historico?: Status[]
  }

export type updateContainer = Omit<Container, 'numero_do' | 'numero_contenedor' | 'createdAt' | 'historico'>

  export interface Status {
    status: string;
    fecha: string;
    observaciones: string;
}