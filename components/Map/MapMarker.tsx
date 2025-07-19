import { CATEGORY_CONFIG } from "@/lib/constants/categories";
import { Resource } from "@/types/resources";

interface MapMarkerProps {
  resource: Resource;
  map: google.maps.Map;
  onClick?: (resource: Resource) => void;
  isSelected?: boolean;
}

class MapMarker {
  private marker: google.maps.Marker;
  private infoWindow: google.maps.InfoWindow;

  constructor({ resource, map, onClick, isSelected }: MapMarkerProps) {
    const categoryConfig = CATEGORY_CONFIG[resource.category];

    this.marker = new google.maps.Marker({
      position: resource.coordinates,
      map: map,
      title: resource.name,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
          this.createMarkerSVG(
            categoryConfig.color,
            categoryConfig.icon,
            isSelected
          )
        )}`,
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32),
      },
      animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
    });

    if (isSelected) {
      let bounceCount = 0;
      const maxBounces = 2;
      const bounceDuration = 700;

      const stopBounce = () => {
        this.marker.setAnimation(null);
      };

      const bounceInterval = setInterval(() => {
        bounceCount++;
        if (bounceCount >= maxBounces) {
          stopBounce();
          clearInterval(bounceInterval);
        } else {
          this.marker.setAnimation(null);
          setTimeout(() => {
            this.marker.setAnimation(google.maps.Animation.BOUNCE);
          }, 50);
        }
      }, bounceDuration);
    }

    this.infoWindow = new google.maps.InfoWindow({
      content: this.createInfoWindowContent(resource),
    });

    this.marker.addListener("click", () => {
      this.infoWindow.open(map, this.marker);
      if (onClick) {
        onClick(resource);
      }
    });

    // Close info window when map is clicked
    map.addListener("click", () => {
      this.infoWindow.close();
    });
  }

  private createMarkerSVG(
    color: string,
    icon: string,
    isSelected?: boolean
  ): string {
    const size = isSelected ? 40 : 32;
    const strokeWidth = isSelected ? 3 : 2;

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="${strokeWidth}"/>
        <text x="16" y="20" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">
          ${icon}
        </text>
      </svg>
    `;
  }

  private createInfoWindowContent(resource: Resource): string {
    const categoryConfig = CATEGORY_CONFIG[resource.category];

    return `
      <div class="p-2 max-w-xs">
        <h3 class="font-bold text-black text-lg mb-1">${resource.name}</h3>
        <p class="text-sm text-black mb-2">${categoryConfig.label}</p>
        <p class="text-sm text-black mb-2">${resource.address}</p>
        ${
          resource.phone
            ? `<p class="text-sm text-black mb-1">📞 ${resource.phone}</p>`
            : ""
        }
        ${
          resource.hours
            ? `<p class="text-sm text-black mb-1">🕒 ${resource.hours}</p>`
            : ""
        }
        ${
          resource.description
            ? `<p class="text-sm text-gray-700 mt-2">${resource.description}</p>`
            : ""
        }
        ${
          resource.rating
            ? `<p class="text-sm text-black mt-2">⭐ ${resource.rating}/5</p>`
            : ""
        }
      </div>
    `;
  }

  public getMarker(): google.maps.Marker {
    return this.marker;
  }

  public destroy(): void {
    this.marker.setMap(null);
    this.infoWindow.close();
  }
}

export default MapMarker;
