export interface SessionApp {
    sessionId : string,
    setSessionId : Function
}

export interface welcomePageParameters {
    AccountType: string,    
    TransferIra: boolean,
    RolloverEmployer: boolean,
    CashContribution: boolean,
    InitialInvestment: string,
    SalesRep: string,
    SpecifiedSource: string,
    ReferralCode: string,
}

//component client <-> server fetch paramters
export interface requestBody{
    session: {sessionId: string, page: string},
    data: any
}

export interface saveWelcomeParameters extends requestBody{
    data: welcomePageParameters
}

export interface saveApplicationId extends requestBody{
    data: applicantId
}

export interface applicantId{
    firstName: string, 
    lastName: string, 
    ssn: string, 
    email: string, 
    confirmEmail: string,
    dob: string, 
    salutation: string,
    maritalStatus: string,
    mothersMaidenName: string,
    occupation: string,
    isSelfEmployed: boolean,
    hasHSA: boolean,
    idType: string, 
    idNumber: string,
    issuedBy:string, 
    issueDate: string, 
    expirationDate: string,
    legalAddress: string, 
    legalCity: string, 
    legalState:string,
    legalZip: string,
    homeAndMailingAddressDifferent: boolean,
    mailingAddress: string, 
    mailingCity: string, 
    mailingState: string,
    mailingZip: string, 
    primaryPhone: string, 
    preferredContactMethod: string, 
    alternatePhone: string, 
    alternatePhoneType: string
}

export interface FormData {
    [key:string] : any
}

export interface beneficiaryForm{
    beneficiary_count__c: number
    beneficiaries: Array<beneficiary>
}

export interface beneficiary{
beneficiary_first_name: string,
beneficiary_last_name: string,
beneficiary_ssn: string,
beneficiary_dob: string,
beneficiary_type: string,
beneficiary_relationship: string,
beneficiary_share: string,
beneficiary_street: string,
beneficiary_city: string, 
beneficiary_state: string,
beneficiary_zip: string,
beneficiary_phone: string,
beneficiary_email: string
}

export const states = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA',  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];
