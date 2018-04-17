import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup
} from '@microsoft/sp-webpart-base';

import * as strings from 'MyCalendarWebPartStrings';
import MyCalendar from './components/MyCalendar';
import { IMyCalendarProps } from './components/IMyCalendarProps';
import ClientMode from './components/ClientMode';


export interface IMyCalendarWebPartProps {
  description: string;
  clientMode: ClientMode;
  title: string;
}

export default class MyCalendarWebPart extends BaseClientSideWebPart<IMyCalendarWebPartProps> {

  public render(): void {

    const element: React.ReactElement<IMyCalendarProps > = React.createElement(
      MyCalendar,
      {
        httpClient: this.context.httpClient,
        title: this.properties.title,
        webPartId: this.context.instanceId
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }) 
              ]
            }
          ]
        }
      ]
    };
  }
}
