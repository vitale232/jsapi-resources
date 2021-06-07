import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  public view: any = null;

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  initializeMap() {
    const container = this.mapViewEl.nativeElement;

    const webmap = new WebMap({
      portalItem: {
        // The original ID works in prod builds.
        // id: "aa1d3f80270146208328cf66d022e09c"
        // Probably related to the default renderer of this WebMap?:
        id: "e691172598f04ea8881cd2a4adaa45ba"
      }
    });

    const view = new MapView({
      container,
      map: webmap
    });

    const bookmarks = new Bookmarks({
      view,
      // allows bookmarks to be added, edited, or deleted
      editingEnabled: true
    });

    const bkExpand = new Expand({
      view,
      content: bookmarks,
      expanded: true
    });

    // Add the widget to the top-right corner of the view
    view.ui.add(bkExpand, "top-right");

    // bonus - how many bookmarks in the webmap?
    webmap.when(() => {
      if (webmap.bookmarks && webmap.bookmarks.length) {
        console.log("Bookmarks: ", webmap.bookmarks.length);
      } else {
        console.log("No bookmarks in this webmap.");
      }
    });

    this.view = view;
    return this.view.when();
  }

  ngOnInit(): any {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then((view) => {
      this.addLegend(view);
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }

  private addLegend(mapView: __esri.MapView): Legend {
    const legend = new Legend({
      view: mapView,
      // The prod-build issue goes away with the "Accidental Deaths" WebMap if the style property is left to the defaults.
      style: {
        type: "card",
        layout: "stack"
      },
      basemapLegendVisible: true
    });

    mapView.ui.add(legend, "bottom-right");

    return legend;
  }
}
