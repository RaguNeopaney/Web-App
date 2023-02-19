using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Voltorb_Flip_Web_App.Models
{
    [Table("HighScoretbl")]
    public class HighScoreboard
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ID { get; set; }

        [Column("HighScore")]
        public long HighScore { get; set; }
    }
}