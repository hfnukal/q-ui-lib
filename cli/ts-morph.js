import { Project, Node } from "ts-morph";
import path from "path";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

// přidání souborů
project.addSourceFilesAtPaths("components/**/index.tsx");

const sourceFiles = project.getSourceFiles();

for (const file of sourceFiles) {
  console.log("FILE:", file.getFilePath());

  const exports = file.getExportedDeclarations();

  exports.forEach((decls, name) => {
    console.log("  export:", name);

    for (const decl of decls) {
      console.log("    kind:", decl.getKindName());
    }
  });
}