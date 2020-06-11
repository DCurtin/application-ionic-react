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
    beneficiary_count: number
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
beneficiary_token: string
}

export interface saveBeneficiary extends requestBody{
    data: beneficiaryPlaceHolder
}

export interface beneficiaryPlaceHolder{
    beneficiary_count__c: number, 
    beneficiary_first_name_1__c: string,
    beneficiary_last_name_1__c:string,
    beneficiary_ssn_1__c:string,
    beneficiary_dob_1__c:string,
    beneficiary_type_1__c: string,
    beneficiary_relationship_1__c:string,
    beneficiary_share_1__c:string,
    beneficiary_street_1__c: string,
    beneficiary_city_1__c:string, 
    beneficiary_state_1__c:string,
    beneficiary_zip_1__c: string,
    beneficiary_phone_1__c: string,
    beneficiary_email_1__c: string,
    beneficiary_token_1__c: string,
    beneficiary_first_name_2__c: string,
    beneficiary_last_name_2__c: string, 
    beneficiary_ssn_2__c: string,
    beneficiary_dob_2__c: string,
    beneficiary_type_2__c: string,
    beneficiary_relationship_2__c:string,
    beneficiary_share_2__c: string,
    beneficiary_street_2__c: string,
    beneficiary_city_2__c:string, 
    beneficiary_state_2__c:string,
    beneficiary_zip_2__c: string,
    beneficiary_phone_2__c: string,
    beneficiary_email_2__c: string,
    beneficiary_token_2__c: string,
    beneficiary_first_name_3__c: string,
    beneficiary_last_name_3__c: string, 
    beneficiary_ssn_3__c: string, 
    beneficiary_dob_3__c: string,
    beneficiary_type_3__c: string,
    beneficiary_relationship_3__c:string,
    beneficiary_share_3__c: string,
    beneficiary_street_3__c: string,
    beneficiary_city_3__c:string, 
    beneficiary_state_3__c:string,
    beneficiary_zip_3__c: string,
    beneficiary_phone_3__c: string,
    beneficiary_email_3__c: string,
    beneficiary_token_3__c: string,
    beneficiary_first_name_4__c: string,
    beneficiary_last_name_4__c: string,
    beneficiary_ssn_4__c:string,
    beneficiary_dob_4__c:string,
    beneficiary_type_4__c:string,
    beneficiary_relationship_4__c:string,
    beneficiary_share_4__c:string,
    beneficiary_street_4__c: string,
    beneficiary_city_4__c:string, 
    beneficiary_state_4__c:string,
    beneficiary_zip_4__c: string,
    beneficiary_phone_4__c: string,
    beneficiary_email_4__c: string,
    beneficiary_token_4__c: string
}

export interface saveFeeArrangement extends requestBody{
    data: feeArrangementForm
}

export interface feeArrangementForm{
    initial_investment_type__c: string,
    fee_schedule__c: string,
    payment_method__c: string,
    cc_number__c: string,
    cc_exp_date__c: string
}

export const states = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA',  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];
