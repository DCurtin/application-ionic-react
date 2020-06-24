export interface AppPage {
    header?: string;
    url: string;
    title: string;
    isValid: Boolean; 
  }

  var appPagesMap: {[key :string]: AppPage} = {
    'Welcome':{
      header: 'Getting Started',
      title: 'Welcome to Midland Trust!',
      url: '/page/Welcome',
      isValid: false,
    },

    'Disclosures':{
      header: 'Getting Started',
      title: 'Disclosures',
      url: '/page/Disclosures',
      isValid: false
    },
    'OwnerInformation':{
      header: 'Open Account',
      title: 'Owner Information',
      url: '/page/OwnerInformation',
      isValid: false
    },
    'PlanInformation':{
      header: 'Open Account',
      title: 'Plan Information',
      url: '/page/PlanInformation',
      isValid: false
    },
    'Beneficiaries':{
      header: 'Open Account',
      title: 'Beneficiaries',
      url: '/page/Beneficiaries',
      isValid: false
    },
    'FeeArrangement':{
      header: 'Open Account',
      title: 'Fee Arrangement',
      url: '/page/FeeArrangement',
      isValid: false
    },
    'AccountNotifications':{
      header: 'Open Account',
      title: 'Account Notifications',
      url: '/page/AccountNotifications',
      isValid: false
    },
    'TransferFromIRA':{
      header: 'Fund Account',
      title: 'Transfer From Existing IRA',
      url: '/page/TransferIRA',
      isValid: false
    },
    'RolloverPlan':{
      header: 'Fund Account',
      title: 'Rollover from Existing Employer Plan',
      url: '/page/RolloverPlan',
      isValid: false
    },
    'NewContribution':{
      header: 'Fund Account',
      title: 'New Contribution',
      url: '/page/NewContribution',
      isValid: false
    },
    'InvestmentDetails':{
      header: 'Make Investment',
      title: 'Investment Details',
      url: '/page/InvestmentDetails',
      isValid: false
    },
    'PaymentInformation':{
      header: 'Finishing Up',
      title: 'Payment Information',
      url: '/page/PaymentInformation',
      isValid: false
    },
    'ReviewAndSign':{
      header: 'Finishing Up',
      title: 'Review and Sign',
      url: '/page/ReviewAndSign',
      isValid: false
    }
};

let appPages: AppPage[] = Object.values(appPagesMap);
  
  export interface PageValidationParamters{
    is_welcome_page_valid: Boolean,
    is_disclosure_page_valid: Boolean,
    is_owner_info_page_valid: Boolean,
    is_beneficiaries_page_valid: Boolean,
    is_fee_arrangement_page_valid: Boolean,
    is_account_notifications_page_valid: Boolean,
    is_transfer_ira_page_valid: Boolean,
    is_rollover_plan_page_valid: Boolean,
    is_investment_details_page_valid: Boolean,
    is_new_contribution_page_valid: Boolean,
    is_payment_information_page_valid: Boolean,
    is_review_and_sign_page_valid: Boolean,
  }

  export interface MenuParameters extends PageValidationParamters{
    planInfo: Boolean,
    transferForm: Boolean,
    rolloverForm: Boolean,
    newContribution: Boolean,
    initialInvestment: Boolean,
    is401k: Boolean
  }

    
export  interface MenuSection {
    header: string;
    pages: AppPage[]
  }

  function generateAppPages(menuParams:MenuParameters){
    let appSections:MenuSection[] = [];
    
    appSections.push(generateWelcomeSection(menuParams));

    appSections.push(generateOpenAccountSection(menuParams));

    if(menuParams.transferForm || menuParams.rolloverForm || menuParams.newContribution)
    {
        appSections.push(generateFundAccountSection(menuParams))
    }

    if(menuParams.initialInvestment)
    {
        appSections.push(generateInvestmentDetailsSection());
    }

    appSections.push(generateFinishingUpSection());

    return appSections;

  }

  function generateWelcomeSection(menuParams: MenuParameters){
    let welcomePages = [...appPages.filter(page => page.header === 'Getting Started')];
    let updatedWelcomePages = welcomePages.map(page => {
      let newPage = {...page};
     if (page.url === '/page/Welcome') {
       newPage.isValid = menuParams.is_welcome_page_valid;
     }
     if (page.url === '/page/Disclosures') {
       newPage.isValid = menuParams.is_disclosure_page_valid;
     }
      return newPage; 
    })
    return {
        header: 'Getting Started',
        pages: updatedWelcomePages
    }
  }

  function generateOpenAccountSection(menuParams : MenuParameters){
    let openAccountPages = [...appPages.filter(page => page.header === 'Open Account')];
    
    if(!menuParams.planInfo){
      console.log('no plan info')
      openAccountPages = [...appPages.filter(page => page.header === 'Open Account' && page.title !== 'Plan Information')]
    }

    let updatedOpenAccountPages = openAccountPages.map(page => {
      let newPage = {...page};
      if (page.url === '/page/OwnerInformation') {
        newPage.isValid = menuParams.is_owner_info_page_valid; 
      }

      return newPage; 
    })

    return {
        header: 'Open Account',
        pages: updatedOpenAccountPages
    }
  }

  function generateFundAccountSection(menuParams:MenuParameters){
    let pages: AppPage[] = [];
    if(menuParams.transferForm){
        pages.push(appPagesMap['TransferFromIRA'])
    }
    if(menuParams.rolloverForm){
        pages.push(appPagesMap['RolloverPlan'])
    }
    if(menuParams.newContribution){
        pages.push(appPagesMap['NewContribution'])
    }

    return {
        header: 'Fund Account',
        pages: pages
    }
  }

  function generateInvestmentDetailsSection(){
      return {
        header: 'Make Investment', 
        pages: [...appPages.filter(page => page.header === 'Make Investment')]
      }
  }

  function generateFinishingUpSection(){
    return {
      header: 'Finishing Up', 
      pages: [...appPages.filter(page => page.header === 'Finishing Up')]
    }
}

  export default generateAppPages