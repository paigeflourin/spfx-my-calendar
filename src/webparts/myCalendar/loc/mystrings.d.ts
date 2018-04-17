declare interface IMyCalendarWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  TitleFieldLabel: string;
}

declare module 'MyCalendarWebPartStrings' {
  const strings: IMyCalendarWebPartStrings;
  export = strings;
}
