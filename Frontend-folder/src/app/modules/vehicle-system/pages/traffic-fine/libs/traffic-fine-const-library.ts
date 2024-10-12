/**
 *  const
 * @export
 * @class ConstLibrary
 */
export class FineConstLibrary {
  public static readonly example = 'example';
  public static readonly lprFineType = 'LprFineType';
  public static readonly ar = 'ar';

  public static readonly toolSet = [
    {
      code: 'heatMap',
      category: 'vs.trafficFine.view',
      value: 'vs.trafficFine.trafficFineHeatMap',
      arrowIcon: false,
    },
    {
      code: 'fine',
      category: 'vs.trafficFine.view',
      value: 'vs.trafficFine.trafficFine',
      arrowIcon: false,
    },
  ];
}
