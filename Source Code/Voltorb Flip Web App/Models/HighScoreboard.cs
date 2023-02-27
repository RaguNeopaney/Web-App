using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Voltorb_Flip_Web_App.Models
{
    [Table("HighScoretbl")]
    public class HighScoreboard
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Column("HighScore")]
        public int HighScore { get; set; }
    }
}