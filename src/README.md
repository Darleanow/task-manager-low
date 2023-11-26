# Code Conventions

The section is all about making clean and proper code.

## Components

All components **must** follow the following rules:

- CamelCasing naming: ComponentOne
- Proper documentation:

```js
/**
 * This component has n parameters:
 * - *p_ParamOne*: Used for ...
 * - *p_ParamTwo*: Used for ...
 *
 * And returns ...
 */
const ComponentOne = ({ p_ParamOne, p_ParamTwo }) => {
  return <></>;
};

export default ComponentOne;
```

- **p\_** prefix for parameters, example above

## Styling

All stylesheets **must** follow the following rules:

- One stylesheet per component **MAXIMUM** (Without theme included)
- All classname used shall start with first and last character from the component it's used within, example:
```js
const Card = () => {
    return(
        <div classname="cd-classname">Sample</div>
    )
}
```
- **All** sizes shall be in relative units (**vh**, **vw**, **%**, and so on...) except for borders and border-radiuses.