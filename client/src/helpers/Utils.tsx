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
    data: applicantIdForm
}

export interface applicantIdForm{
    is_self_employed: boolean,
    has_hsa: boolean,
    home_and_mailing_address_different: boolean,
    first_name?: string, 
    last_name?: string, 
    ssn?: string, 
    email?: string
    dob?: string, 
    salutation?: string,
    marital_status?: string,
    mothers_maiden_name?: string,
    occupation?: string,
    id_type?: string, 
    id_number?: string,
    id_issued_by?:string, 
    id_issued_date?: string, 
    id_expiration_date?: string,
    legal_street?: string, 
    legal_city?: string, 
    legal_state?:string,
    legal_zip?: string,
    mailing_street?: string, 
    mailing_city?: string, 
    mailing_state?: string,
    mailing_zip?: string, 
    primary_phone?: string, 
    preferred_contact_method?: string, 
    alternate_phone?: string, 
    alternate_phone_type?: string
}

export interface FormData {
    [key:string] : any
}

export interface beneficiaryForm{
    beneficiary_count: number
    beneficiaries: Array<beneficiary>
}

export interface beneficiary{
first_name: string,
last_name: string,
ssn: string,
dob: string,
type: string,
relationship: string,
share_percentage: number,
mailing_street: string,
mailing_city: string, 
mailing_state: string,
mailing_zip: string,
phone: string,
email: string
token: string
}

export interface saveFeeArrangement extends requestBody{
    data: feeArrangementForm
}

export interface feeArrangementForm{
    initial_investment_type: string,
    fee_schedule: string,
    payment_method: string,
    cc_number: string,
    cc_exp_date: string
}
export const initialInvestmentTypes = ['I\'m Not Sure', 'Futures/Forex', 'Closely-Held LLC', 'Private Placement', 'Promissory Note (Unsecured)', 'Promissory Note (Secured by Real Estate)', 'Promissory Note (Secured by Other)', 'Precious Metals', 'Real Estate', 'Other'];

export interface accountNotificationsForm{
    ira_statement_option: string
    online_access: boolean,
    include_interested_party: boolean,
    statement_option: string, 
    first_name: string, 
    last_name: string, 
    email: string, 
    phone:string, 
    mailing_street: string,
    mailing_city: string,
    mailing_state: string,
    mailing_zip: string,
    company_name: string,
    title: string, 
}

export interface transferForm{
    existing_transfers: number,
    account_type: string,
    transfers: Array<transfer>
}

export interface transfer{
    account_number: string,
    institution_name: string,
    contact_name: string,
    contact_phone_number: string,
    mailing_street: string,
    mailing_city: string,
    mailing_state: string,
    mailing_zip: string,
    account_type: string,
    transfer_type: string,
    delivery_method: string,
    asset_name_1: string, //number mid
    asset_name_2: string, //number mid
    asset_name_3: string, //number mid
    full_or_partial_cash_transfer: string,
    cash_amount: number,
    index: number
}

export const states = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA',  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];
