import {deal, dealFields, person} from "../types.ts";

export async function CreatePerson(name: string, phone: string, email: string, token: string) {
  const response = await fetch("https://api.pipedrive.com/v1/persons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`,
    },
    body: JSON.stringify({
      name: name,
      phone: [
        {
          value: phone,
        }
      ],
      email: [
        {
          value: email,
        }
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as person;
}

export async function UpdateDeal(
  title: string,
  personId: number,
  jobType: number, jobTypeId: string,
  jobSource: number, jobSourceId: string,
  jobDescription: string, jobDescriptionId: string,
  Address: string, AddressId: string,
  City: string, CityId: string,
  State: string, StateId: string,
  ZipCode: string, ZipCodeId: string,
  Area: number, AreaId: string,
  jobDate: Date, jobDateId: string,
  jobStartTime: Date, jobStartTimeId: string,
  jobEndTime: Date, jobEndTimeId: string,
  TestSelect: number, TestSelectId: string,
  token: string, deal: string
) {
  const response = await fetch(`https://api.pipedrive.com/v1/deals/${deal}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`,
    },
    body: JSON.stringify({
      title: title,
      person_id: personId,

      [jobTypeId]: jobType,
      [jobSourceId]: jobSource,
      [jobDescriptionId]: jobDescription,

      [AreaId]: Area,
      [CityId]: City,
      [StateId]: State,
      [ZipCodeId]: ZipCode,
      [AddressId]: Address,

      [jobDateId]: jobDate,
      [jobStartTimeId]: jobStartTime,
      [jobEndTimeId]: jobEndTime,
      [TestSelectId]: TestSelect,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as deal;
}

export async function CreateDeal(
  title: string,
  personId: number,
  jobType: number, jobTypeId: string,
  jobSource: number, jobSourceId: string,
  jobDescription: string, jobDescriptionId: string,
  Address: string, AddressId: string,
  City: string, CityId: string,
  State: string, StateId: string,
  ZipCode: string, ZipCodeId: string,
  Area: number, AreaId: string,
  jobDate: Date, jobDateId: string,
  jobStartTime: Date, jobStartTimeId: string,
  jobEndTime: Date, jobEndTimeId: string,
  TestSelect: number, TestSelectId: string,
  token: string
) {
  const response = await fetch("https://api.pipedrive.com/v1/deals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`,
    },
    body: JSON.stringify({
      title: title,
      person_id: personId,

      [jobTypeId]: jobType,
      [jobSourceId]: jobSource,
      [jobDescriptionId]: jobDescription,

      [AreaId]: Area,
      [CityId]: City,
      [StateId]: State,
      [ZipCodeId]: ZipCode,
      [AddressId]: Address,

      [jobDateId]: jobDate,
      [jobStartTimeId]: jobStartTime,
      [jobEndTimeId]: jobEndTime,
      [TestSelectId]: TestSelect,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as deal;
}

export async function GetFields(token: string) {
  const response = await fetch("https://api.pipedrive.com/v1/dealFields", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as dealFields;
}

export async function GetDeal(token: string, deal: string) {
  const response = await fetch(`https://api.pipedrive.com/v1/deals/${deal}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as deal;
}