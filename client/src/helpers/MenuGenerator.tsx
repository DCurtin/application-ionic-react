import { archiveOutline, archiveSharp, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';

export interface AppPage {
    header?: string;
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
  }

  var appPagesMap: {[key :string]: AppPage} = {
    'Welcome':{
      header: 'Getting Started',
      title: 'Welcome to Midland Trust!',
      url: '/page/Welcome',
      iosIcon: mailOutline,
      mdIcon: mailSharp
    },

    'Disclosures':{
      header: 'Getting Started',
      title: 'Disclosures',
      url: '/page/Disclosures',
      iosIcon: paperPlaneOutline,
      mdIcon: paperPlaneSharp
    },
    'OwnerInformation':{
      header: 'Open Account',
      title: 'Owner Information',
      url: '/page/OwnerInformation',
      iosIcon: heartOutline,
      mdIcon: heartSharp
    },
    'PlanInformation':{
      header: 'Open Account',
      title: 'Plan Information',
      url: '/page/PlanInformation',
      iosIcon: archiveOutline,
      mdIcon: archiveSharp
    },
    'Beneficiaries':{
      header: 'Open Account',
      title: 'Beneficiaries',
      url: '/page/Beneficiaries',
      iosIcon: archiveOutline,
      mdIcon: archiveSharp
    },
    'FeeArrangement':{
      header: 'Open Account',
      title: 'Fee Arrangement',
      url: '/page/FeeArrangement',
      iosIcon: trashOutline,
      mdIcon: trashSharp
    },
    'AccountNotifications':{
      header: 'Open Account',
      title: 'Account Notifications',
      url: '/page/AccountNotifications',
      iosIcon: warningOutline,
      mdIcon: warningSharp
    },
    'TransferFromIRA':{
      header: 'Fund Account',
      title: 'Transfer From Existing IRA',
      url: '/page/TransferIRA',
      iosIcon: archiveOutline,
      mdIcon: archiveSharp
    },
    'RolloverPlan':{
      header: 'Fund Account',
      title: 'Rollover from Existing Employer Plan',
      url: '/page/RolloverPlan',
      iosIcon: trashOutline,
      mdIcon: trashSharp
    },
    'NewContribution':{
      header: 'Fund Account',
      title: 'New Contribution',
      url: '/page/NewContribution',
      iosIcon: warningOutline,
      mdIcon: warningSharp
    },
    'InvestmentDetails':{
      header: 'Make Investment',
      title: 'Investment Details',
      url: '/page/InvestmentDetails',
      iosIcon: warningOutline,
      mdIcon: warningSharp
    },
    'PaymentInformation':{
      header: 'Finishing Up',
      title: 'Payment Information',
      url: '/page/PaymentInformation',
      iosIcon: warningOutline,
      mdIcon: warningSharp
    },
    'ReviewAndSign':{
      header: 'Finishing Up',
      title: 'Review and Sign',
      url: '/page/ReviewAndSign',
      iosIcon: warningOutline,
      mdIcon: warningSharp
    }
};

let appPages: AppPage[] = Object.values(appPagesMap);
  

  export interface MenuParamters{
    planInfo: Boolean,
    transferForm: Boolean,
    rolloverForm: Boolean,
    newContribution: Boolean,
    initialInvestment: Boolean
  }

    
export  interface AppSection {
    header: string;
    pages: AppPage[]
  }

  function generateAppPages(menuParams:MenuParamters){
    let appSections:AppSection[] = [];
    
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

  function generateFundAccountSection(menuParams:MenuParamters){
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