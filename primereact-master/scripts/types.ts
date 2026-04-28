type ExtensionsKeyType = Record<
  string,
  string | string[] | boolean | Record<string, string>
>;

export type ColorsCollectionsValue = {
  $type: 'color';
  $value: {
    colorSpace: string;
    components: number[];
    alpha: number;
    hex: string;
  };
  $extensions: ExtensionsKeyType;
};

type AlphaColors = 'white' | 'black';

type AlphaGraduatedColors =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '1000';

type ColorsCollectionAlpha = {
  [key in AlphaColors]: {
    [key in AlphaGraduatedColors]: ColorsCollectionsValue;
  };
};

type SolidColors =
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'emerald'
  | 'green'
  | 'lime'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone';

type SolidGraduatedColors =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950';

type ColorsCollectionSolid = {
  [key in SolidColors]: {
    [key in SolidGraduatedColors]: ColorsCollectionsValue;
  };
};

export type ColorsCollection = {
  alpha: ColorsCollectionAlpha;
  solid: ColorsCollectionSolid;
};

export type DesignFontsUnionCollection =
  | 'fontFamily'
  | 'fontWeight'
  | 'fontSize'
  | 'lineHeight';

export type DesignScaleUnionCollection =
  | 'borderRadius'
  | 'borderWidth'
  | 'spacing'
  | 'sizing'
  | 'opacity';

export type DesignRecordType<T = string | number> = Record<string, T>;

export type DesignCollection = {
  [key: string]: DesignCollectionsValue;
};

export type DesignRootCollection = {
  [key: string]: DesignCollection;
};

export type DesignCollectionsValue = {
  $type: 'number' | 'string';
  $value: number | string;
  $extensions: ExtensionsKeyType;
};
