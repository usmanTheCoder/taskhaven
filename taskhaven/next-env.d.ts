import 'next';
import 'next/types/global';

declare module '*.css' {
  const styles: { [key: string]: string };
  export default styles;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}