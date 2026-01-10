#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
DOCS_DIR="docs"
WIKI_REMOTE="git@github.com:RobiFerentz/axis-gpu.wiki.git"

echo -e "${BLUE}📚 Publishing documentation to GitHub Wiki...${NC}"

# Check if docs directory exists
if [ ! -d "$DOCS_DIR" ]; then
    echo -e "${RED}❌ Error: docs directory not found!${NC}"
    echo "Please run 'npm run docs' first to generate documentation."
    exit 1
fi

# Navigate to docs directory
cd "$DOCS_DIR" || exit 1

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo -e "${BLUE}🔧 Initializing git repository in docs folder...${NC}"
    git init
    git checkout -b master 2>/dev/null || git checkout master
fi

# Check if wiki remote exists, if not add it
if ! git remote | grep -q "wiki"; then
    echo -e "${BLUE}🔗 Adding wiki remote...${NC}"
    git remote add wiki "$WIKI_REMOTE"
else
    echo -e "${BLUE}🔗 Updating wiki remote URL...${NC}"
    git remote set-url wiki "$WIKI_REMOTE"
fi

# Create a _Sidebar.md for better navigation
echo -e "${BLUE}📝 Creating wiki sidebar...${NC}"
cat > _Sidebar.md << 'EOF'
## Axis GPU Documentation

### [Home](README)

### Core
- [GPUContext](classes/GPUContext)
- [Renderer](classes/Renderer)
- [Scene](classes/Scene)
- [SceneNode](classes/SceneNode)

### Camera
- [Camera](classes/Camera)
- [Camera2D](classes/Camera2D)
- [Camera3D](classes/Camera3D)

### Geometry
- [Geometry](classes/Geometry)
- [Mesh](classes/Mesh)
- [WireframeMesh](classes/WireframeMesh)

### Shapes
- [CubeGeometry](classes/CubeGeometry)
- [SphereGeometry](classes/SphereGeometry)
- [PlaneGeometry](classes/PlaneGeometry)
- [CylinderGeometry](classes/CylinderGeometry)
- [DodecahedronGeometry](classes/DodecahedronGeometry)

### Materials
- [Material](classes/Material)
- [BasicMaterial](classes/BasicMaterial)
- [TexturedMaterial](classes/TexturedMaterial)
- [GradientMaterial](classes/GradientMaterial)
- [VertexColorMaterial](classes/VertexColorMaterial)
- [WireframeMaterial](classes/WireframeMaterial)

### Math
- [Vec2](classes/Vec2), [Vec3](classes/Vec3), [Vec4](classes/Vec4)
- [Mat3](classes/Mat3), [Mat4](classes/Mat4)
- [Quaternion](classes/Quaternion)
- [Transform](classes/Transform)

### Animation
- [AnimationMixer](classes/AnimationMixer)
- [AnimationClip](classes/AnimationClip)
- [AnimationTrack](classes/AnimationTrack)
- [Tween](classes/Tween)
- [Easing](classes/Easing)

### Textures
- [Texture](classes/Texture)
- [TextureLoader](classes/TextureLoader)
- [ProceduralTextures](classes/ProceduralTextures)

### Reference
- [All Classes](classes)
- [All Interfaces](interfaces)
- [Type Aliases](type-aliases)
- [Variables](variables)
EOF

# Stage all files
echo -e "${BLUE}📦 Staging documentation files...${NC}"
git add .

# Check if there are changes to commit
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${GREEN}✓ No changes to commit${NC}"
else
    # Commit changes
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}💾 Committing changes...${NC}"
    git commit -m "Update documentation - $TIMESTAMP"
fi

# Push to wiki
echo -e "${BLUE}🚀 Pushing to GitHub Wiki...${NC}"
git push wiki master --force

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Documentation successfully published to wiki!${NC}"
    echo -e "${GREEN}🌐 View at: https://github.com/RobiFerentz/axis-gpu/wiki${NC}"
else
    echo -e "${RED}❌ Error: Failed to push to wiki${NC}"
    exit 1
fi

# Return to root directory
cd ..

echo -e "${GREEN}✨ Done!${NC}"
