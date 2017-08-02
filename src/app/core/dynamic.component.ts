import {
    Component,
    Input,
    ViewContainerRef,
    ViewChild,
    ReflectiveInjector,
    ComponentFactoryResolver
} from '@angular/core';

@Component({
    selector: 'dynamic-component',
    template: `
    <div #dynamicComponentContainer overlayTarget="{{targetOverlay}}"></div>
  `,
})
export class DynamicComponent {
    private currentComponent = null;
    public targetOverlay: string;

    @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) private dynamicComponentContainer: ViewContainerRef;

    // component: Class for the component you want to create
    // inputs: An object with key/value pairs mapped to input name/input value
    @Input() set componentData(data: {component: any, inputs: any, targetOverlay: string }) {
        if (!data) {
            return;
        }

        // Inputs need to be in the following format to be resolved properly
        let inputProviders = Object.keys(data.inputs).map((inputName) => {
            return {provide: inputName, useValue: data.inputs[inputName]};
        });
        let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

        // We create an injector out of the data we want to pass down and this components injector
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);

        // We create a factory out of the component we want to create
        let factory = this.resolver.resolveComponentFactory(data.component);

        // We create the component using the factory and the injector
        let component = factory.create(injector);

        // We insert the component into the dom container
        this.dynamicComponentContainer.insert(component.hostView);
        this.dynamicComponentContainer.element.nativeElement.setAttribute('targetOverlay', factory.selector);

        // We can destroy the old component is we like by calling destroy
        if (this.currentComponent) {
            this.currentComponent.destroy();
        }

        this.currentComponent = component;
    }

    constructor(private resolver: ComponentFactoryResolver) {

    }

    public getComponentInstance(): any {
        return this.currentComponent.instance;
    }
}
