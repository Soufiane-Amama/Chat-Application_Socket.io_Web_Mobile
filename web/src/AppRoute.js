import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * AppRoute Component
 * 
 * This component is used to create routes that include authorization logic.
 * It renders the given component if the `can` function returns true; otherwise, it redirects to the specified path.
 * 
 * @param {React.Component} component - The component to render if authorized.
 * @param {Function} can - A function that returns a boolean indicating whether the user is authorized.
 * @param {string} redirect - The path to redirect to if the user is not authorized.
 * @param {Object} rest - Any additional props to pass to the Route component.
 * @returns {React.Component} - A Route component with authorization logic.
 */


const AppRoute = ({component: Component, can = () => true, redirect, ...rest}) => (
    <Route {...rest} render= {(props) => (
        can() ? <Component {...props} /> : <Redirect to={redirect} />
    )} />
);

export default AppRoute;


/**
المكون AppRoute هو مكون مخصص في React يتم استخدامه لإدارة التوجيه الشرطي داخل التطبيق.
يتيح لك هذا المكون تحديد شرط يتم بناءً عليه عرض مكون معين أو إعادة التوجيه إلى مسار آخر إذا لم يتحقق الشرط.

إليك توضيح لكيفية عمل هذا المكون:

استيراد التبعيات:
يتم استيراد React لاستخدام JSX وإنشاء المكونات.
يتم استيراد Route و Redirect من مكتبة react-router-dom لإدارة التوجيه في التطبيق.

تعريف المكون:
AppRoute هو مكون سهمي يأخذ عددًا من الخصائص (props):
component: هو المكون الذي تريد عرضه إذا تحقق الشرط.
can: هو دالة تحدد الشرط الذي يجب تحققه لعرض المكون. القيمة الافتراضية لهذه الدالة هي true.
redirect: هو المسار الذي يتم إعادة التوجيه إليه إذا لم يتحقق الشرط.
...rest: يتم تمرير باقي الخصائص إلى مكون Route.

تنفيذ المكون:
يتم تمرير جميع الخصائص إلى مكون Route باستخدام {...rest}.
يتم تحديد الخاصية render لمكون Route لتحديد ما يجب أن يتم عرضه بناءً على تحقق الشرط:
إذا كانت الدالة can() تُرجع true، يتم عرض المكون المحدد Component وتمرير الخصائص إليه باستخدام {...props}.
إذا كانت الدالة can() تُرجع false، يتم إعادة التوجيه إلى المسار المحدد في redirect.
**/