export interface dealFields {
  data: {
    id: number | null;
    key: string;
    name: string;
    field_type: string;
    options: {
      id: number;
      label: string;
    }[] | undefined;
  }[]
}

export interface deal {
  data: Record<string, string | number | Object | null>
}

export interface person {
  data: {
    id: number;
    name: string;
    phone: [
      {
        value: string;
      }
    ];
    email: [
      {
        value: string;
      }
    ];
  }
}