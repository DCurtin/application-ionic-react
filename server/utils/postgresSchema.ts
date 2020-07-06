/* tslint:disable */


/**
 * AUTO-GENERATED FILE @ 2020-07-03 11:40:02 - DO NOT EDIT!
 *
 * This file was automatically generated by schemats v.3.0.3
 * $ schemats generate -c postgres://username:password@localhost/postgres -t contribution -t transfer -t application_session -t rollover -t interested_party -t validated_pages -t initial_investment -t payment -t applicant -t beneficiary -t body -t fee_arrangement -s salesforce
 *
 */


export namespace contributionFields {
    export type new_contribution_amount = number | null;
    export type tax_year = string | null;
    export type name_on_account = string | null;
    export type bank_account_type = string | null;
    export type routing_number = string | null;
    export type account_number = string | null;
    export type bank_name = string | null;
    export type account_type = string | null;
    export type session_id = string;

}

export interface contribution {
    new_contribution_amount: contributionFields.new_contribution_amount;
    tax_year: contributionFields.tax_year;
    name_on_account: contributionFields.name_on_account;
    bank_account_type: contributionFields.bank_account_type;
    routing_number: contributionFields.routing_number;
    account_number: contributionFields.account_number;
    bank_name: contributionFields.bank_name;
    account_type: contributionFields.account_type;
    session_id: contributionFields.session_id;

}

export namespace transferFields {
    export type account_number = string | null;
    export type institution_name = string | null;
    export type contact_name = string | null;
    export type contact_phone_number = string | null;
    export type mailing_street = string | null;
    export type mailing_city = string | null;
    export type mailing_state = string | null;
    export type mailing_zip = string | null;
    export type account_type = string | null;
    export type transfer_type = string | null;
    export type delivery_method = string | null;
    export type asset_name_1 = string | null;
    export type asset_name_2 = string | null;
    export type asset_name_3 = string | null;
    export type full_or_partial_cash_transfer = string | null;
    export type cash_amount = number | null;
    export type index = number;
    export type key = string;
    export type session_id = string;

}

export interface transfer {
    account_number: transferFields.account_number;
    institution_name: transferFields.institution_name;
    contact_name: transferFields.contact_name;
    contact_phone_number: transferFields.contact_phone_number;
    mailing_street: transferFields.mailing_street;
    mailing_city: transferFields.mailing_city;
    mailing_state: transferFields.mailing_state;
    mailing_zip: transferFields.mailing_zip;
    account_type: transferFields.account_type;
    transfer_type: transferFields.transfer_type;
    delivery_method: transferFields.delivery_method;
    asset_name_1: transferFields.asset_name_1;
    asset_name_2: transferFields.asset_name_2;
    asset_name_3: transferFields.asset_name_3;
    full_or_partial_cash_transfer: transferFields.full_or_partial_cash_transfer;
    cash_amount: transferFields.cash_amount;
    index: transferFields.index;
    key: transferFields.key;
    session_id: transferFields.session_id;

}

export namespace application_sessionFields {
    export type account_number = string;
    export type application_id = string;
    export type last_active = number;
    export type session_id = string;

}

export interface application_session {
    account_number: application_sessionFields.account_number;
    application_id: application_sessionFields.application_id;
    last_active: application_sessionFields.last_active;
    session_id: application_sessionFields.session_id;

}

export namespace rolloverFields {
    export type cash_amount = number | null;
    export type institution_name = string | null;
    export type account_type = string | null;
    export type account_number = string | null;
    export type rollover_type = string | null;
    export type name = string | null;
    export type phone = string | null;
    export type mailing_street = string | null;
    export type mailing_city = string | null;
    export type mailing_state = string | null;
    export type mailing_zip = string | null;
    export type index = number | null;
    export type key = string;
    export type session_id = string;

}

export interface rollover {
    cash_amount: rolloverFields.cash_amount;
    institution_name: rolloverFields.institution_name;
    account_type: rolloverFields.account_type;
    account_number: rolloverFields.account_number;
    rollover_type: rolloverFields.rollover_type;
    name: rolloverFields.name;
    phone: rolloverFields.phone;
    mailing_street: rolloverFields.mailing_street;
    mailing_city: rolloverFields.mailing_city;
    mailing_state: rolloverFields.mailing_state;
    mailing_zip: rolloverFields.mailing_zip;
    index: rolloverFields.index;
    key: rolloverFields.key;
    session_id: rolloverFields.session_id;

}

export namespace interested_partyFields {
    export type first_name = string | null;
    export type last_name = string | null;
    export type email = string | null;
    export type phone = string | null;
    export type title = string | null;
    export type company_name = string | null;
    export type ira_statement_option = string | null;
    export type statement_option = string | null;
    export type mailing_street = string | null;
    export type mailing_city = string | null;
    export type mailing_state = string | null;
    export type mailing_zip = string | null;
    export type online_access = boolean | null;
    export type include_interested_party = boolean | null;
    export type session_id = string;

}

export interface interested_party {
    first_name: interested_partyFields.first_name;
    last_name: interested_partyFields.last_name;
    email: interested_partyFields.email;
    phone: interested_partyFields.phone;
    title: interested_partyFields.title;
    company_name: interested_partyFields.company_name;
    ira_statement_option: interested_partyFields.ira_statement_option;
    statement_option: interested_partyFields.statement_option;
    mailing_street: interested_partyFields.mailing_street;
    mailing_city: interested_partyFields.mailing_city;
    mailing_state: interested_partyFields.mailing_state;
    mailing_zip: interested_partyFields.mailing_zip;
    online_access: interested_partyFields.online_access;
    include_interested_party: interested_partyFields.include_interested_party;
    session_id: interested_partyFields.session_id;

}

export namespace validated_pagesFields {
    export type is_welcome_page_valid = boolean | null;
    export type is_disclosure_page_valid = boolean | null;
    export type is_owner_info_page_valid = boolean | null;
    export type is_beneficiaries_page_valid = boolean | null;
    export type is_fee_arrangement_page_valid = boolean | null;
    export type is_account_notifications_page_valid = boolean | null;
    export type is_transfer_ira_page_valid = boolean | null;
    export type is_rollover_plan_page_valid = boolean | null;
    export type is_investment_details_page_valid = boolean | null;
    export type is_new_contribution_page_valid = boolean | null;
    export type is_payment_information_page_valid = boolean | null;
    export type is_review_and_sign_page_valid = boolean | null;
    export type session_id = string;

}

export interface validated_pages {
    is_welcome_page_valid: validated_pagesFields.is_welcome_page_valid;
    is_disclosure_page_valid: validated_pagesFields.is_disclosure_page_valid;
    is_owner_info_page_valid: validated_pagesFields.is_owner_info_page_valid;
    is_beneficiaries_page_valid: validated_pagesFields.is_beneficiaries_page_valid;
    is_fee_arrangement_page_valid: validated_pagesFields.is_fee_arrangement_page_valid;
    is_account_notifications_page_valid: validated_pagesFields.is_account_notifications_page_valid;
    is_transfer_ira_page_valid: validated_pagesFields.is_transfer_ira_page_valid;
    is_rollover_plan_page_valid: validated_pagesFields.is_rollover_plan_page_valid;
    is_investment_details_page_valid: validated_pagesFields.is_investment_details_page_valid;
    is_new_contribution_page_valid: validated_pagesFields.is_new_contribution_page_valid;
    is_payment_information_page_valid: validated_pagesFields.is_payment_information_page_valid;
    is_review_and_sign_page_valid: validated_pagesFields.is_review_and_sign_page_valid;
    session_id: validated_pagesFields.session_id;

}

export namespace initial_investmentFields {
    export type initial_investment_type = string | null;
    export type initial_investment_name = string | null;
    export type investment_contact_person = string | null;
    export type investment_contact_person_phone = string | null;
    export type investment_amount = number | null;
    export type session_id = string;

}

export interface initial_investment {
    initial_investment_type: initial_investmentFields.initial_investment_type;
    initial_investment_name: initial_investmentFields.initial_investment_name;
    investment_contact_person: initial_investmentFields.investment_contact_person;
    investment_contact_person_phone: initial_investmentFields.investment_contact_person_phone;
    investment_amount: initial_investmentFields.investment_amount;
    session_id: initial_investmentFields.session_id;

}

export namespace paymentFields {
    export type payment_amount = number | null;
    export type status_details = string | null;
    export type status = string | null;
    export type session_id = string;

}

export interface payment {
    payment_amount: paymentFields.payment_amount;
    status_details: paymentFields.status_details;
    status: paymentFields.status;
    session_id: paymentFields.session_id;

}

export namespace applicantFields {
    export type salutation = string | null;
    export type first_name = string | null;
    export type middle_name = string | null;
    export type last_name = string | null;
    export type ssn = string | null;
    export type dob = string | null;
    export type email = string | null;
    export type primary_phone = string | null;
    export type marital_status = string | null;
    export type alternate_phone = string | null;
    export type alternate_phone_type = string | null;
    export type preferred_contact_method = string | null;
    export type mothers_maiden_name = string | null;
    export type occupation = string | null;
    export type mailing_street = string | null;
    export type mailing_city = string | null;
    export type mailing_state = string | null;
    export type mailing_zip = string | null;
    export type legal_street = string | null;
    export type legal_city = string | null;
    export type legal_state = string | null;
    export type legal_zip = string | null;
    export type id_type = string | null;
    export type id_number = string | null;
    export type id_issued_by = string | null;
    export type id_issued_date = string | null;
    export type id_expiration_date = string | null;
    export type home_and_mailing_address_different = boolean | null;
    export type has_hsa = boolean | null;
    export type is_self_employed = boolean | null;
    export type application_id = string | null;
    export type account_number = string | null;
    export type heroku_token = string;
    export type session_id = string;

}

export interface applicant {
    salutation: applicantFields.salutation;
    first_name: applicantFields.first_name;
    middle_name: applicantFields.middle_name;
    last_name: applicantFields.last_name;
    ssn: applicantFields.ssn;
    dob: applicantFields.dob;
    email: applicantFields.email;
    primary_phone: applicantFields.primary_phone;
    marital_status: applicantFields.marital_status;
    alternate_phone: applicantFields.alternate_phone;
    alternate_phone_type: applicantFields.alternate_phone_type;
    preferred_contact_method: applicantFields.preferred_contact_method;
    mothers_maiden_name: applicantFields.mothers_maiden_name;
    occupation: applicantFields.occupation;
    mailing_street: applicantFields.mailing_street;
    mailing_city: applicantFields.mailing_city;
    mailing_state: applicantFields.mailing_state;
    mailing_zip: applicantFields.mailing_zip;
    legal_street: applicantFields.legal_street;
    legal_city: applicantFields.legal_city;
    legal_state: applicantFields.legal_state;
    legal_zip: applicantFields.legal_zip;
    id_type: applicantFields.id_type;
    id_number: applicantFields.id_number;
    id_issued_by: applicantFields.id_issued_by;
    id_issued_date: applicantFields.id_issued_date;
    id_expiration_date: applicantFields.id_expiration_date;
    home_and_mailing_address_different: applicantFields.home_and_mailing_address_different;
    has_hsa: applicantFields.has_hsa;
    is_self_employed: applicantFields.is_self_employed;
    application_id: applicantFields.application_id;
    account_number: applicantFields.account_number;
    heroku_token: applicantFields.heroku_token;
    session_id: applicantFields.session_id;

}

export namespace beneficiaryFields {
    export type first_name = string | null;
    export type last_name = string | null;
    export type ssn = string | null;
    export type dob = string | null;
    export type email = string | null;
    export type phone = string | null;
    export type type = string | null;
    export type relationship = string | null;
    export type share_percentage = number | null;
    export type mailing_street = string | null;
    export type mailing_city = string | null;
    export type mailing_state = string | null;
    export type mailing_zip = string | null;
    export type index = number | null;
    export type key = string;
    export type session_id = string;

}

export interface beneficiary {
    first_name: beneficiaryFields.first_name;
    last_name: beneficiaryFields.last_name;
    ssn: beneficiaryFields.ssn;
    dob: beneficiaryFields.dob;
    email: beneficiaryFields.email;
    phone: beneficiaryFields.phone;
    type: beneficiaryFields.type;
    relationship: beneficiaryFields.relationship;
    share_percentage: beneficiaryFields.share_percentage;
    mailing_street: beneficiaryFields.mailing_street;
    mailing_city: beneficiaryFields.mailing_city;
    mailing_state: beneficiaryFields.mailing_state;
    mailing_zip: beneficiaryFields.mailing_zip;
    index: beneficiaryFields.index;
    key: beneficiaryFields.key;
    session_id: beneficiaryFields.session_id;

}

export namespace bodyFields {
    export type account_type = string | null;
    export type referral_code = string | null;
    export type investment_type = string | null;
    export type sales_rep = string | null;
    export type referred_by = string | null;
    export type case_management = string | null;
    export type investment_amount = number | null;
    export type credit_card = Object | null;
    export type bank_account = Object | null;
    export type transfer_form = boolean | null;
    export type rollover_form = boolean | null;
    export type has_read_diclosure = boolean | null;
    export type cash_contribution_form = boolean | null;
    export type session_id = string;

}

export interface body {
    account_type: bodyFields.account_type;
    referral_code: bodyFields.referral_code;
    investment_type: bodyFields.investment_type;
    sales_rep: bodyFields.sales_rep;
    referred_by: bodyFields.referred_by;
    case_management: bodyFields.case_management;
    investment_amount: bodyFields.investment_amount;
    credit_card: bodyFields.credit_card;
    bank_account: bodyFields.bank_account;
    transfer_form: bodyFields.transfer_form;
    rollover_form: bodyFields.rollover_form;
    has_read_diclosure: bodyFields.has_read_diclosure;
    cash_contribution_form: bodyFields.cash_contribution_form;
    session_id: bodyFields.session_id;

}

export namespace fee_arrangementFields {
    export type fee_schedule = string | null;
    export type payment_method = string | null;
    export type cc_number = string | null;
    export type cc_exp_date = string | null;
    export type session_id = string;

}

export interface fee_arrangement {
    fee_schedule: fee_arrangementFields.fee_schedule;
    payment_method: fee_arrangementFields.payment_method;
    cc_number: fee_arrangementFields.cc_number;
    cc_exp_date: fee_arrangementFields.cc_exp_date;
    session_id: fee_arrangementFields.session_id;

}