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

export const states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];