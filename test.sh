VERSION=v1.15.1
VERSION=${VERSION#v}
VERSIONS=(${VERSION//-/ })
VERSIONS=(${VERSIONS//./ })

echo ${VERSIONS[0]}
echo ${VERSIONS[1]}
echo ${VERSIONS[2]}
