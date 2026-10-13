import matplotlib.pyplot as plt
import numpy as np

# Set up canvas with rich royal background
fig, ax = plt.subplots(figsize=(8, 8), facecolor='#1A0B2E')
ax.set_facecolor('#1A0B2E')
ax.axis('off')

# Outer golden decorative rings
theta = np.linspace(0, 2*np.pi, 500)
ax.plot(1.0 * np.cos(theta), 1.0 * np.sin(theta), color='#D4AF37', linewidth=3)
ax.plot(0.95 * np.cos(theta), 0.95 * np.sin(theta), color='#D4AF37', linewidth=1.5, linestyle='--')

# Royal radial ornaments
for angle in np.linspace(0, 2*np.pi, 12, endpoint=False):
    ax.plot([0.85 * np.cos(angle), 1.05 * np.cos(angle)],
            [0.85 * np.sin(angle), 1.05 * np.sin(angle)],
            color='#D4AF37', linewidth=2)

# Intertwined Initials S and V
ax.text(-0.15, 0.05, 'S', fontsize=120, fontweight='bold',
        fontfamily='serif', color='#FFD700',
        ha='center', va='center', style='italic', alpha=0.95)

ax.text(0.18, -0.05, 'V', fontsize=120, fontweight='bold',
        fontfamily='serif', color='#DAA520',
        ha='center', va='center', alpha=0.9)

# Traditional Indian royal star accents
for angle in np.linspace(0, 2*np.pi, 8, endpoint=False):
    ax.scatter(0.75 * np.cos(angle), 0.75 * np.sin(angle),
               color='#FFD700', s=50, marker='*')

ax.set_xlim(-1.2, 1.2)
ax.set_ylim(-1.2, 1.2)

plt.savefig(
    'royal_monogram_SV.png',
    dpi=300,
    bbox_inches='tight',
    facecolor=fig.get_facecolor(),
    edgecolor='none'
)
plt.close()