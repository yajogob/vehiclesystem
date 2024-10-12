import { Component } from '@angular/core';
import { GomapCluster, MapMode, Marker } from '@interface/gomap';
import { Locations } from 'src/app/mocks/locations';

@Component({
  selector: 'vb-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss'],
})
export class WidgetsComponent {

  zoom = 9;
  mapMode: MapMode = '2D';


  locations = Locations.map(item => {
    const content =
      `<svg width="30" height="37" viewBox="0 0 42 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35.0431 6.01945C27.0337 -2.00648 14.0203 -2.00648 6.01097 6.01945C2.26723 9.76163 0.115077 14.8062 0.00448251
        20.0984C-0.106112 25.3906 1.83342 30.5206 5.41755 34.4159L19.3617 49.5996C19.5105 49.76 19.6908 49.888 19.8913
        49.9755C20.0919 50.063 20.3084 50.1082 20.5272 50.1082C20.746 50.1082 20.9625 50.063 21.163 49.9755C21.3636 49.888
        21.5439 49.76 21.6927 49.5996L35.6365 34.416C39.2207 30.5207 41.1602 25.3906 41.0496 20.0984C40.939 14.8062 38.7868
        9.76163 35.0431 6.01945Z" fill="#437570"/>
        <g clip-path="url(#clip0_116_1399)">
        <path d="M20 27.8109L11.875 23.168V28.1659L20 32.6793L28.125 28.1659V23.168L20 27.8109Z" fill="white"/>
        <path d="M33.0127 18.7501L20 11.3142L6.9873 18.7501L20 26.186L30.5625 20.1501V28.5001H33V18.7572L33.0127 18.7501Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_116_1399">
        <rect width="26" height="26" fill="white" transform="translate(7 9)"/>
        </clipPath>
        </defs>
        </svg>
        `;

    return {
      coordinates: {
        lat: Number(item.latitude),
        lng: Number(item.longitude),
      },
      content,
      data: {...item},
    } as Marker;
  });

  markers: Marker[] = [];

  trackers = [];

  cluster: GomapCluster[] = [
    {
      locations: this.locations.slice(0, 8),
      clusterOption: {
        element: (count): string => `
        <svg width="117" height="79" viewBox="0 0 117 79" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="6" width="112" height="60" rx="16" fill="black" />
          <rect x="13" y="16" width="40" height="40" rx="12" fill="#437570" />
          <path d="M44.1559 44.4V32C44.1559 29.7908 42.365 28 40.1559 28H26.0041C23.795 28 22.0041 29.7908 22.0041 32V44.4"
            stroke="white" stroke-width="3" />
          <rect x="19" y="42.48" width="6.16" height="2.64" fill="white" />
          <rect x="41" y="42.48" width="6.16" height="2.64" fill="white" />
          <rect x="27.1324" y="23" width="3.03448" height="2.4" fill="white" />
          <rect x="31.9876" y="23" width="3.03448" height="2.4" fill="white" />
          <rect x="37.1462" y="23" width="3.03448" height="2.4" fill="white" />
          <g clip-path="url(#clip0_1543_1064)">
            <text x="65" y="30" fill="white" class="text-xs">Gantry</text>
            <text x="70" y="50" fill="white" class="font-bold">${ count }</text>
          </g>
          <defs>
            <clipPath id="clip0_1543_1064">
              <rect width="40" height="48" transform="translate(65 12)" />
            </clipPath>
          </defs>
        </svg>`,
      },
    },
    {
      locations: [...this.locations.slice(8, 20), this.locations[20], this.locations[20]],
      clusterOption: {
        element: (count): string => `
          <svg width="162" height="60" viewBox="0 0 162 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="162" height="60" rx="16" fill="black" />
            <rect x="10" y="10" width="40" height="40" rx="12" fill="#752E6E" />
            <g clip-path="url(#clip0_1069_6252)">
              <path
                d="M37.3186 26.5442H33.1786V21.7114C33.1782 19.6611 31.5175 18.0004 29.4672 18H23.6814C21.6311
                18.0004 19.9704 19.6611 19.9699 21.7114V41H21.6324V21.7114C21.6329 21.1432 21.8606 20.6362 22.2327
                20.2628C22.6062 19.8906 23.1131 19.6629 23.6814 19.6624H29.4672C30.0354 19.6629 30.5424 19.8906 30.9158
                20.2628C31.2879 20.6362 31.5157 21.1432 31.5161 21.7114V41H33.1786V28.2067H37.3186C37.8869 28.2071 38.3939
                28.4349 38.7673 28.807C39.1394 29.1805 39.3671 29.6875 39.3676 30.2557V41H41.0301V30.2557C41.0296 28.2054 39.3689
                26.5447 37.3186 26.5442Z"
                fill="white" />
              <path d="M25.4296 23.9116H24.0007V26.3363H25.4296V23.9116Z" fill="white" />
              <path d="M28.9629 23.9116H27.534V26.3363H28.9629V23.9116Z" fill="white" />
              <path d="M25.4296 29.4538H24.0007V31.8785H25.4296V29.4538Z" fill="white" />
              <path d="M28.9629 29.4538H27.534V31.8785H28.9629V29.4538Z" fill="white" />
              <path d="M25.4296 34.996H24.0007V37.4207H25.4296V34.996Z" fill="white" />
              <path d="M28.9629 34.996H27.534V37.4207H28.9629V34.996Z" fill="white" />
              <path d="M36.7566 31.0125H35.3278V33.4372H36.7566V31.0125Z" fill="white" />
              <path d="M36.7566 36.3238H35.3278V38.7485H36.7566V36.3238Z" fill="white" />
            </g>
            <g clip-path="url(#clip1_1069_6252)">
              <text x="65" y="30" fill="white" class="text-xs">Testing </text>
              <text x="70" y="50" fill="white" class="font-bold">${ count }</text>
            </g>
            <defs>
              <clipPath id="clip0_1069_6252">
                <rect width="23" height="23" fill="white" transform="translate(19 18)" />
              </clipPath>
              <clipPath id="clip1_1069_6252">
                <rect width="90" height="48" fill="white" transform="translate(62 6)" />
              </clipPath>
            </defs>
          </svg>`,
      },
    },
    {
      locations: this.locations.slice(20, 34),
      clusterOption: {
        element: (count): string => `
          <svg width="117" height="79" viewBox="0 0 117 79" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="112" height="60" rx="16" fill="black" />
            <rect x="13" y="16" width="40" height="40" rx="12" fill="#437570" />
            <path d="M44.1559 44.4V32C44.1559 29.7908 42.365 28 40.1559 28H26.0041C23.795 28 22.0041 29.7908 22.0041 32V44.4"
              stroke="white" stroke-width="3" />
            <rect x="19" y="42.48" width="6.16" height="2.64" fill="white" />
            <rect x="41" y="42.48" width="6.16" height="2.64" fill="white" />
            <rect x="27.1324" y="23" width="3.03448" height="2.4" fill="white" />
            <rect x="31.9876" y="23" width="3.03448" height="2.4" fill="white" />
            <rect x="37.1462" y="23" width="3.03448" height="2.4" fill="white" />
            <g clip-path="url(#clip0_1543_1064)">
              <text x="65" y="30" fill="white" class="text-xs">Type 1</text>
              <text x="70" y="50" fill="white" class="font-bold">${ count }</text>
            </g>
            <defs>
              <clipPath id="clip0_1543_1064">
                <rect width="40" height="48" transform="translate(65 12)" />
              </clipPath>
            </defs>
          </svg>`,
      },
    },
  ];


  heatmap = [];


  increaseZoom(): void {
    this.zoom++;
  }

  decreaseZoom(): void {
    this.zoom--;
  }

  // eslint-disable-next-line class-methods-use-this
  handleMarkerClickFn(marker: Marker): void {
    // eslint-disable-next-line no-console
    console.log(marker);
  }

  // eslint-disable-next-line class-methods-use-this
  handleClusterMarkerClickFn(markers: Marker[]): void {
    // eslint-disable-next-line no-console
    console.log('cluster markers', markers);
  }

}
