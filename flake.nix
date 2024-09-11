{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = (import (inputs.nixpkgs) { inherit system; });
      in
      {
        devShell = pkgs.mkShell {
          shellHook = ''
              $SHELL
          '';

          buildInputs = with pkgs; [
            git
            zip

            nodejs_22
            pnpm

            # nix related
            nixpkgs-fmt
          ];
        };
        
      }
    );
}