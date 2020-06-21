export interface AppPage {
    header?: string;
    url: string;
    title: string;
    isValid: boolean;
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
    is401k: Boolean
  }

    
export  interface MenuSection {
    header: string;
    pages: AppPage[]
  }

  function generateAppPages(menuParams:MenuParameters){
    let appSections:MenuSection[] = [];
    
    appSections.push(generateWelcomeSection());

    appSections.push(generateOpenAccountSection(menuParams.planInfo));

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

  function generateWelcomeSection(){
    return {
        header: 'Getting Started',
        pages: [...appPages.filter(page => page.header === 'Getting Started')]
    }
  }

  function generateOpenAccountSection(includePlanInfo : Boolean){
    if(includePlanInfo){
      console.log('plan info')
        var pages:AppPage[] = [...appPages.filter(page => page.header === 'Open Account')]
    }else{
      console.log('no plan info')
        var pages:AppPage[] = [...appPages.filter(page => page.header === 'Open Account' && page.title !== 'Plan Information')]
    }
    
    return {
        header: 'Open Account',
        pages: pages
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