declare module 'country-currency-map' {
    export function getName(countryCode: string): string;
    export function getCurrency(countryCode: string): string;
    export function getSymbol(countryCode: string): string;
    export function getCurrencyAbbreviation(countryCode: string): string;
    export function getCountry(currencyAbbreviation: string): string;
  }
  
  declare module 'country-list' {
    interface Country {
      code: string;
      name: string;
    }
  
    interface CountryList {
      getData: () => Country[];
      getCode: (name: string) => string;
      getName: (code: string) => string;
      getCodes: () => string[];
      getNames: () => string[];
    }
  
    const countryList: CountryList;
    export default countryList;
  }