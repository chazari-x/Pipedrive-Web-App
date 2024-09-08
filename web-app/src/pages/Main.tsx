import {FC, useEffect, useState} from "react";
import {InputText} from "primereact/inputtext";
import {InputMask} from "primereact/inputmask";
import {CascadeSelect} from "primereact/cascadeselect";
import {InputTextarea} from "primereact/inputtextarea";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import {CreateDeal, CreatePerson, GetFields, UpdateDeal} from "../api/api.ts";
import {Nullable} from "primereact/ts-helpers";

const Main: FC<{
  job: string
  setJob: (job: string) => void
  token: string
  setUpdated: (updated: boolean) => void
}> = ({token, setUpdated, job, setJob}) => {
  useEffect(() => {
    GetFields(token)
      .then((fields) => {
        fields.data.map((field) => {
          switch (field.name) {
            case "Job type":
              setJobTypeId(field.key)
              setJobTypes(field.options)
              break;
            case "Job source":
              setJobSourceId(field.key)
              setJobSources(field.options)
              break;
            case "Test select":
              setTestSelectId(field.key)
              setTestSelects(field.options)
              break;
            case "Area":
              setAreaId(field.key)
              setAreas(field.options)
              break;
            case "Job date":
              setStartDateId(field.key)
              break;
            case "Job start time":
              setStartTimeId(field.key)
              break;
            case "Job end time":
              setEndTimeId(field.key)
              break;
            case "Job description":
              setJobDescriptionId(field.key)
              break;
            case "Address":
              setAddressId(field.key)
              break;
            case "City":
              setCityId(field.key)
              break;
            case "State":
              setStateId(field.key)
              break;
            case "Zip code":
              setZipCodeId(field.key)
              break;
          }
        })
      })
      .catch(console.error)
  })

  const [firstName, setFirstName] = useState<string>()
  const [firstNameInvalid, setFirstNameInvalid] = useState(false)
  const [lastName, setLastName] = useState<string>()
  const [lastNameInvalid, setLastNameInvalid] = useState(false)
  const [phone, setPhone] = useState<string | null>()
  const [phoneInvalid, setPhoneInvalid] = useState(false)
  const [email, setEmail] = useState<string>()

  const [jobTypeId, setJobTypeId] = useState<string>()
  const [jobType, setJobType] = useState<{ label: string; id: number }>()
  const [jobTypeInvalid, setJobTypeInvalid] = useState(false)
  const [jobTypes, setJobTypes] = useState<{ label: string; id: number }[] | undefined>();

  const [jobSourceId, setJobSourceId] = useState<string>()
  const [jobSource, setJobSource] = useState<{ label: string; id: number }>()
  const [jobSourceInvalid, setJobSourceInvalid] = useState(false)
  const [jobSources, setJobSources] = useState<{ label: string; id: number }[] | undefined>();

  const [jobDescriptionId, setJobDescriptionId] = useState<string>()
  const [jobDescription, setJobDescription] = useState<string>()

  const [addressId, setAddressId] = useState<string>()
  const [address, setAddress] = useState<string>()
  const [addressInvalid, setAddressInvalid] = useState(false)

  const [cityId, setCityId] = useState<string>()
  const [city, setCity] = useState<string>()
  const [cityInvalid, setCityInvalid] = useState(false)

  const [stateId, setStateId] = useState<string>()
  const [state, setState] = useState<string>()
  const [stateInvalid, setStateInvalid] = useState(false)

  const [zipCodeId, setZipCodeId] = useState<string>()
  const [zipCode, setZipCode] = useState<string>()
  const [zipCodeInvalid, setZipCodeInvalid] = useState(false)

  const [areaId, setAreaId] = useState<string>()
  const [area, setArea] = useState<{ label: string; id: number }>()
  const [areaInvalid, setAreaInvalid] = useState(false)
  const [areas, setAreas] = useState<{ label: string; id: number }[] | undefined>();

  const [startDateId, setStartDateId] = useState<string>()
  const [startDate, setStartDate] = useState<Nullable<Date>>(new Date())
  const [startDateInvalid, setStartDateInvalid] = useState(false)

  const [startTimeId, setStartTimeId] = useState<string>()
  const [startTime, setStartTime] = useState<Nullable<Date>>(new Date())

  const [endTimeId, setEndTimeId] = useState<string>()
  const [endTime, setEndTime] = useState<Nullable<Date>>(new Date())

  const [testSelectId, setTestSelectId] = useState<string>()
  const [testSelect, setTestSelect] = useState<{ label: string; id: number }>()
  const [testSelectInvalid, setTestSelectInvalid] = useState(false)
  const [testSelects, setTestSelects] = useState<{ label: string; id: number }[] | undefined>();

  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)

  const validate = () => {
    setFirstNameInvalid(!firstName)
    setLastNameInvalid(!lastName)
    setPhoneInvalid(!phone)
    setJobTypeInvalid(!jobType)
    setJobSourceInvalid(!jobSource)
    setAddressInvalid(!address)
    setCityInvalid(!city)
    setStateInvalid(!state)
    setZipCodeInvalid(!zipCode)
    setAreaInvalid(!area)
    setStartDateInvalid(!startDate)
    if (!startTime) setStartTime(new Date())
    if (!endTime) setEndTime(new Date())
    setTestSelectInvalid(!testSelect)

    return !(!firstName || !lastName || !phone || !jobType || !jobSource || !address
      || !city || !state || !zipCode || !area || !startDate || !startTime || !endTime || !testSelect
      || !jobTypeId || !jobSourceId || !jobDescriptionId || !addressId || !cityId || !stateId || !zipCodeId
      || !areaId || !startDateId || !startTimeId || !endTimeId || !testSelectId)
  }

  const updateJob = async () => {
    if (validate()) return

    setUpdating(true)

    CreatePerson(firstName + " " + lastName, phone!, email ?? "", token)
      .then((person) => {
        UpdateDeal(
          "Job of " + firstName,
          person.data.id,

          jobType!.id, jobTypeId!,
          jobSource!.id, jobSourceId!,
          jobDescription ?? "", jobDescriptionId!,

          address!, addressId!,
          city!, cityId!,
          state!, stateId!,
          zipCode!, zipCodeId!,
          area!.id, areaId!,

          startDate!, startDateId!,
          startTime!, startTimeId!,
          endTime!, endTimeId!,
          testSelect!.id, testSelectId!,

          token, job
        )
          .then((deal) => {
            console.log(deal)
            setUpdated(true)
          })
          .catch(console.error)
          .finally(() => setUpdating(false))
      })
      .catch((e) => {
        console.error(e)
        setUpdating(false)
      })
  }

  const createJob = async () => {
    if (validate()) return

    setCreating(true)

    CreatePerson(firstName + " " + lastName, phone!, email ?? "", token)
      .then((person) => {
        CreateDeal(
          "Job of " + firstName,
          person.data.id,

          jobType!.id, jobTypeId!,
          jobSource!.id, jobSourceId!,
          jobDescription ?? "", jobDescriptionId!,

          address!, addressId!,
          city!, cityId!,
          state!, stateId!,
          zipCode!, zipCodeId!,
          area!.id, areaId!,

          startDate!, startDateId!,
          startTime!, startTimeId!,
          endTime!, endTimeId!,
          testSelect!.id, testSelectId!,

          token
        )
          .then((deal) => {
            console.log(deal)
            setJob(deal.data.id.toString())
            setUpdated(true)
          })
          .catch(console.error)
          .finally(() => setCreating(false))
      })
      .catch((e) => {
        console.error(e)
        setCreating(false)
      })
  }

  return <div className="main">
    <div className="page">
      <form>
        <div className="title">Client details</div>
        <div className="line">
          <InputText invalid={firstNameInvalid && !firstName} value={firstName} placeholder="First name"
                     onChange={(e) => setFirstName(e.target.value)}/>
          <InputText invalid={lastNameInvalid && !lastName} value={lastName} placeholder="Last name"
                     onChange={(e) => setLastName(e.target.value)}/>
        </div>
        <InputMask invalid={phoneInvalid && !phone} value={phone} mask="(999) 999-9999" placeholder="Phone"
                   onChange={(e) => setPhone(e.value)}/>
        <InputText value={email} placeholder="Email (optional)"
                   onChange={(e) => setEmail(e.target.value)}/>
      </form>

      <form>
        <div className="title">Job details</div>
        <div className="line">
          <CascadeSelect invalid={jobTypeInvalid && !jobType} value={jobType} options={jobTypes}
                         optionLabel="label" optionGroupChildren={[]} placeholder="Job type"
                         onChange={(e) => setJobType(e.value)}/>
          <CascadeSelect invalid={jobSourceInvalid && !jobSource} value={jobSource} options={jobSources}
                         optionLabel="label" optionGroupChildren={[]} placeholder="Job source"
                         onChange={(e) => setJobSource(e.value)}/>
        </div>
        <InputTextarea value={jobDescription} rows={4} cols={30} placeholder="Job description (optional)" autoResize
                       onChange={(e) => setJobDescription(e.target.value)}/>
      </form>

      <form>
        <div className="title">Service location</div>
        <InputText invalid={addressInvalid && !address} value={address} placeholder="Address"
                   onChange={(e) => setAddress(e.target.value)}/>
        <InputText invalid={cityInvalid && !city} value={city} placeholder="City"
                   onChange={(e) => setCity(e.target.value)}/>
        <InputText invalid={stateInvalid && !state} value={state} placeholder="State"
                   onChange={(e) => setState(e.target.value)}/>
        <div className="line">
          <InputText invalid={zipCodeInvalid && !zipCode} value={zipCode} placeholder="Zip code"
                     onChange={(e) => setZipCode(e.target.value)}/>
          <CascadeSelect invalid={areaInvalid && !area} value={area} optionLabel="label"
                         optionGroupChildren={[]} placeholder="Area"
                         onChange={(e) => setArea(e.value)} options={areas}/>
        </div>
      </form>

      <form>
        <div className="title">Scheduled</div>
        <div className="p-inputgroup flex-1">
          <Calendar invalid={startDateInvalid} value={startDate} placeholder="Start date"
                    onChange={(e) => setStartDate(e.value)}/>
          <span className="p-inputgroup-addon"><i className="pi pi-calendar"></i></span>
        </div>
        <div className="line">
          <div className="p-inputgroup flex-1">
            <Calendar value={startTime} timeOnly placeholder="Start time"
                      onChange={(e) => setStartTime(e.value)}/>
            <span className="p-inputgroup-addon"><i className="pi pi-clock"></i></span>
          </div>
          <div className="p-inputgroup flex-1">
            <Calendar value={endTime} timeOnly placeholder="End time"
                      onChange={(e) => setEndTime(e.value)}/>
            <span className="p-inputgroup-addon"><i className="pi pi-clock"></i></span>
          </div>
        </div>
        <CascadeSelect invalid={testSelectInvalid} value={testSelect} options={testSelects}
                       optionLabel="label" optionGroupChildren={[]} placeholder="Test select"
                       onChange={(e) => setTestSelect(e.value)}/>
      </form>
    </div>

    <div className="buttons">
      <Button label={!creating ? "Create job" : "Request is sent"} rounded onClick={createJob}
              severity={creating ? "danger" : undefined} disabled={creating || updating}/>
      <Button label={!updating ? "Save info" : "Request is sent"} rounded onClick={updateJob}
              severity={updating ? "danger" : undefined} disabled={updating || creating}/>
    </div>
  </div>
}

export default Main;