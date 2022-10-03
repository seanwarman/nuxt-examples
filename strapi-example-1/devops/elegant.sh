IFS='='
env | while read -r var value ; do
    env=$2
    file=$1
    var="$(echo $var | sed "s!_$env!!g")"
    gitvar='"GITVAR_'$var'"'
    value='"'$value'"'
    sed -i "s!$gitvar!$value!g" $file
done
