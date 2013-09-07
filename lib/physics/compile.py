INPUT_FILES = []

INPUT_FILES.append("jellyphysics.js")

INPUT_FILES.append("queue.js")

INPUT_FILES.append("bitmask.js")

INPUT_FILES.append("internalspring.js")

INPUT_FILES.append("jellyprerequisites.js")
INPUT_FILES.append("vector2.js")
INPUT_FILES.append("pointmass.js")
INPUT_FILES.append("aabb.js")
INPUT_FILES.append("vectortools.js")
INPUT_FILES.append("closedshape.js")

INPUT_FILES.append("body.js")
INPUT_FILES.append("bodycollisioninfo.js")
INPUT_FILES.append("materialmanager.js")
INPUT_FILES.append("world.js")
INPUT_FILES.append("springbody.js")
INPUT_FILES.append("pressurebody.js")

INPUT_FILES.append("ray.js")

INPUT_FILES.append("bodybuilder.js")
INPUT_FILES.append("bodyblueprint.js")
INPUT_FILES.append("bodyfactory.js")
INPUT_FILES.append("particle.js")
INPUT_FILES.append("particlecannon.js")

INPUT_FILES.append("joints/distancejoint.js")
INPUT_FILES.append("joints/pinjoint.js")
INPUT_FILES.append("joints/interpolationjoint.js")

INPUT_FILES.append("springbuilder.js")

INPUT_FILES.append("contactmanager.js")

INPUT_FILES.append("quadtree.js")

WRAPPER_FILE = "wrap.js"
REPLACE_TEXT = "// CODE HERE"

TARGET_FILE = "physics.js"

OUTPUT = ""

def main():
        global OUTPUT
        with open(WRAPPER_FILE, "r") as wrapper:
                OUTPUT += wrapper.read()
        for inputFile in INPUT_FILES:
                with open(inputFile, "r") as input:
                        OUTPUT = OUTPUT.replace(REPLACE_TEXT, input.read() + REPLACE_TEXT)
        OUTPUT = OUTPUT.replace(REPLACE_TEXT, "")
        with open(TARGET_FILE, "w") as target:
                target.write(OUTPUT)

if __name__ == "__main__":
        main()
