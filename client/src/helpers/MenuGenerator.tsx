import { pathToFileURL } from "url";

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
  

  export interface MenuParameters{
    planInfo: Boolean,
    transferForm: Boolean,
    rolloverForm: Boolean,
    newContribution: Boolean,
    initialInvestment: Boolean,
    is401k: Boolean,
    isWelcomePageValid: Boolean, 
    isDisclosurePageValid: Boolean, 
    isOwnerInfoPageValid: Boolean,
    [key:string] : any
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
        appSections.push(generateInvestmentDetailsSection(menuParams));
    }

    appSections.push(generateFinishingUpSection(menuParams));

    return appSections;

  }

  function generateWelcomeSection(menuParams: MenuParameters){
    let welcomePages = [...appPages.filter(page => page.header === 'Getting Started')];
    let updatedWelcomePages = welcomePages.map(page => {
      let newPage = {...page};
     if (page.url === '/page/Welcome') {
       newPage.isValid = menuParams.isWelcomePageValid;
     }
     if (page.url === '/page/Disclosures') {
       newPage.isValid = menuParams.isDisclosurePageValid;
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
    
    if(!menuParams.includePlanInfo){
      console.log('no plan info')
      openAccountPages = [...appPages.filter(page => page.header === 'Open Account' && page.title !== 'Plan Information')]
    }

    let updatedOpenAccountPages = openAccountPages.map(page => {
      let newPage = {...page};
      let url = page.url; 
      if (url === '/page/OwnerInformation') {
        newPage.isValid = menuParams.isOwnerInfoPageValid; 
      }
      if (url === '/page/PlanInformation') {
        newPage.isValid = menuParams.isPlanInfoPageValid; 
      }
      if (url === '/page/Beneficiaries') {
        newPage.isValid = menuParams.isBenificiariesPageValid;
      }
      if (url === '/page/FeeArrangement') {
        newPage.isValid = menuParams.isFeeArrangementPageValid;
      }
      if (url === '/page/AccountNotifications'){
        newPage.isValid = menuParams.isAccountNotificationsPageValid; 
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

    let fundAccountPages = [...pages]; 
    let updatedFundAccountPages = fundAccountPages.map(page => {
      let newPage = {...page}; 
      let url = page.url; 
      if (url === '/page/TransferIRA') {
        newPage.isValid = menuParams.isTransferIRAPageValid; 
      }
      if (url === '/page/RolloverPlan'){
        newPage.isValid = menuParams.isRolloverPlanPageValid; 
      }
      if (url === '/page/NewContribution') {
        newPage.isValid = menuParams.isNewContributionPageValid; 
      }
      return newPage; 
    })
    return {
        header: 'Fund Account',
        pages: updatedFundAccountPages
    }
  }

  function generateInvestmentDetailsSection(menuParams: MenuParameters){
    let investmentDetailsPages =  [...appPages.filter(page => page.header === 'Make Investment')]
    let updatedInvestmentDetailsPages = investmentDetailsPages.map(page => {
      let newPage = {...page};
      if (page.url === '/page/InvestmentDetails'){
        newPage.isValid = menuParams.isInvestmentDetailsValid; 
      }
      return newPage;
    });
    
    return {
        header: 'Make Investment', 
        pages: updatedInvestmentDetailsPages
      }
  }

  function generateFinishingUpSection(menuParams: MenuParameters){
    let finishingUpPages = [...appPages.filter(page => page.header === 'Finishing Up')];
    let updatedFinishingUpPages = finishingUpPages.map(page => {
      let newPage = {...page};
      if (page.url === '/page/PaymentInformation'){
        newPage.isValid = menuParams.isPaymentInfoPageValid; 
      }

      return newPage; 
    })

    return {
      header: 'Finishing Up', 
      pages: [...appPages.filter(page => page.header === 'Finishing Up')]
    }
}

  export default generateAppPages